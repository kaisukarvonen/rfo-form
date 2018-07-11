import React from 'react';
import { Container, Header, Form as SemanticForm, Popup, Icon, Grid, Label, Message, Button, Accordion } from 'semantic-ui-react';
import _ from 'lodash';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import 'moment/locale/fi';
import moment from 'moment';
import CompanyForm from './CompanyForm';
import Extras from './Extras';
import PrivatePersonForm from './PrivatePersonForm';
import createHTML from './Template';
import { lan, getCalendarEvents } from '../utils';

class Form extends React.Component {
  state = {
    type: undefined,
    popupOpen: false,
    from: undefined,
    to: undefined,
    personAmount: 1,
    errors: {},
    activeIndex: 0,
  };

  componentDidMount = () => {
    getCalendarEvents().then((response) => {
      console.log(response.data);
      console.log(response.data.items);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.locationType && (prevState.personAmount !== this.state.personAmount || prevState.locationType !== this.state.locationType)) {
      const object = this.getObject(this.state.locationType);
      let error;
      if (object.min || object.max) {
        const min = object.min || 0;
        const { max } = object;
        if (this.state.personAmount < min || this.state.personAmount > max) {
          error = lan === 'fi' ? `Antamasi henkilömäärä ei täsmää valitsemasi tilan '${object[lan]}' kanssa` :
            `You cannot visit ${object[lan]} with ${this.state.personAmount} persons, please change your selections`;
        }
      }
      this.setState({ errors: { ...this.state.errors, personAmountError: error } });
    }
  }

  getTimeOptions = () => {
    const times = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
    const options = [];
    times.forEach((hour) => {
      options.push({ key: hour, value: hour, text: `${hour}:00` });
    });
    return options;
  }

  getObject = key => _.find(this.props.fields, { key });
  getObjectInList = (key, innerKey) => _.find(this.getObject(key).options, { key: innerKey });


  handleOnChange = (e, data) => {
    this.setState({
      [data.id]: data.type === 'checkbox' ? data.checked : data.value,
      visitType: data.id === 'visitTypeString' ? undefined : this.state.visitType,
      lunchType: data.id === 'lunch' ? undefined : this.state.lunchType,
      dinnerType: data.id === 'dinner' ? undefined : this.state.dinnerType,
    });
  }


  handleOnRadioChange = (e, data, id) => {
    let newState = {};
    const values = { locationType: undefined, meetingType: undefined, visitTypeString: '' };
    if (id === 'type' && this.state.type !== data.value) {
      newState = {
        ...values, visitType: undefined, companyName: '', errors: { ...this.state.errors, personAmountError: undefined },
      };
    } else if (id === 'visitType' && this.state.visitType !== data.value) {
      newState = values;
    }
    this.setState({ [id]: data.value, ...newState });
  }


  toggleDatePicker = () => {
    this.setState({ popupOpen: !this.state.popupOpen });
  }

  handleDayClick = (day) => {
    let { to, from } = this.state;
    if (!from) {
      from = day;
    } else if (!to) {
      to = day;
    }
    if (to && from) {
      // check if we change to or from date when both are already defined
      // new picked date is earlier than from
      if (moment(day).diff(moment(from), 'days') < 0) {
        from = day;
      } else if (moment(from).diff(moment(to), 'days') === 0) {
        from = undefined;
        to = undefined;
      } else {
        to = day;
      }
    }
    // do not change on past days
    if (moment().diff(day, 'days') <= 0) {
      this.setState({ to, from });
    }
  }

  foodOptions = (key) => {
    const object = this.getObject(key);
    const number = object.options ? object.options.length : '';
    return lan === 'fi' ? `${number} vaihtoehtoa` : `${number} options`;
  }

  calculatePrice = () => {
    let price = 0;
    if (this.state.meetingType) {
      price += this.getObjectInList('meetingOptions', this.state.meetingType).price;
    }
    if (this.state.linen) {
      price += this.getObject('linen').price * this.state.personAmount;
    }
    if (this.state.towels) {
      price += this.getObject('towels').price * this.state.personAmount;
    }
    if (this.state.hottub) {
      price += this.getObject('hottub').price;
    }
    return price;
  }


  isValid = () => {
    const date = this.state.to || this.state.from;
    const mandatoryFields = [this.state.name, this.state.email, this.state.phone, date, this.state.arrivalTime,
      this.state.departTime, this.state.personAmount, this.state.type];
    if (!mandatoryFields.includes('') && !mandatoryFields.includes(undefined)) {
      this.setState({ errors: { ...this.state.errors, mandatoryFields: undefined } });
      return true;
    }
    return false;
  }


  sendMail = () => {
    if (this.isValid() && !this.state.errors.personAmountError) {
      const description = lan === 'en' && 'Asiakas on tehnyt tarjouspyynnön englanninkielisillä sivuilla.';
      const html = createHTML(this.createDataFields(), description);
      this.props.sendMail(this.state.email, html);
      window.scrollTo(0, 0);
    } else {
      const e = lan === 'fi' ? 'Täytä pakolliset kentät!' : 'Please fill out all mandatory fields!';
      this.setState({ errors: { ...this.state.errors, mandatoryFields: e } });
    }
  }

  createDataFields = () => {
    const data = this.state;
    const basicInfo = {
      title: this.getObject('contactDetails').fi,
      [this.getObject('name').fi]: data.name,
      [this.getObject('email').fi]: data.email,
      [this.getObject('phone').fi]: data.phone,
      [this.getObject('dates').fi]: this.dateToStr(data.from, data.to),
      [this.getObject('arrivalTime').fi]: `klo ${data.arrivalTime}`,
      [this.getObject('departTime').fi]: `klo ${data.departTime}`,
      [this.getObject('personAmount').fi]: data.personAmount,
      Asiakastyyppi: this.getObject(data.type).fi,
      Hinta: `${this.calculatePrice()} €`,
    };
    const foods = ['breakfastCoffee', 'breakFast', 'nokipannu', 'dessert', 'supper', 'lunch', 'lunchType', 'dinner', 'dinnerType', 'allergies'];
    const food = { title: 'Tarjoilut' };
    foods.forEach((f) => {
      if (data[f]) {
        if (f === 'lunchType') {
          food.Lounasvalinta = this.getObjectInList('lunch', data[f]).fi;
        } else if (f === 'dinnerType') {
          food.Illallisvalinta = this.getObjectInList('dinner', data[f]).fi;
        } else {
          food[this.getObject(f).fi] = typeof (data[f]) === 'boolean' ? 'Kyllä' : data[f];
        }
      }
    });

    const activities = { title: 'Aktiviteetit' };
    this.getObject('activityOptions').options.forEach((ac) => {
      if (data[ac.key]) {
        activities[this.getObjectInList('activityOptions', ac.key).fi] = 'Kyllä';
      }
    });
    this.getObject('rentalTitle').options.forEach((rental) => {
      if (data[rental.key]) {
        activities[this.getObjectInList('rentalTitle', rental.key).fi] = 'Kyllä';
      }
    });
    const services = ['linen', 'towels', 'hottub'];
    const extraServices = { title: 'Lisäpalvelut' };
    services.forEach((s) => {
      if (data[s]) {
        extraServices[this.getObject(s).fi] = 'Kyllä';
      }
    });
    const visitDetails = { title: 'Vierailun lisätiedot' };
    const details = ['companyName', 'visitType', 'visitTypeString', 'meetingType', 'locationType'];
    details.forEach((d) => {
      if (data[d]) {
        if (d === 'meetingType') {
          const object = this.getObjectInList('meetingOptions', data[d]);
          visitDetails['Kokouksen tyyppi'] = `${object.fi} - ${object.duration}h`;
        } else if (d === 'visitType') {
          visitDetails['Vierailun tyyppi'] = this.getObject(data.visitType).fi;
        } else if (d === 'visitTypeString') {
          visitDetails['Vierailun tyyppi'] = data.visitTypeString;
        } else if (d === 'locationType') {
          visitDetails.Tilat = this.getObject(data[d]).fi;
        } else {
          visitDetails[this.getObject(d).fi] = typeof (data[d]) === 'boolean' ? 'Kyllä' : data[d];
        }
      }
    });
    return {
      basicInfo,
      food,
      activities,
      extraServices,
      visitDetails,
    };
  }


  dateToStr = (from, to) => {
    if (from && to) {
      return moment(to).diff(moment(from), 'days') !== 0 ? `${moment(from).format('DD.MM.YYYY')} - ${moment(to).format('DD.MM.YYYY')}` : moment(from).format('DD.MM.YYYY');
    } else if (from && !to) {
      return moment(from).format('DD.MM.YYYY');
    }
    return '';
  }


  showInfo = (object) => {
    const infoField = lan === 'fi' ? 'infoFi' : 'infoEn';
    return object[infoField];
  }


  render() {
    const styles = {
      categoryHeader: {
        cursor: 'pointer',
        width: '180px',
        marginTop: 0,
      },
      categoryItems: {
        padding: '0 0 12px 12px',
      },
    };
    const { from, to } = this.state;
    const modifiers = { start: from, end: to };
    const dateValue = this.dateToStr(from, to);
    const timeOptions = this.getTimeOptions();
    return (
      <Container style={{ margin: '20px 0 20px 0' }}>
        <SemanticForm style={{ maxWidth: '900px' }} noValidate="novalidate">
          <Header as="h4" dividing>{this.getObject('contactDetails')[lan]}</Header>
          <SemanticForm.Group widths="equal">
            <SemanticForm.Input required label={this.getObject('name')[lan]} id="name" onChange={this.handleOnChange} />
            <SemanticForm.Input required label={this.getObject('email')[lan]} id="email" onChange={this.handleOnChange} />
            <SemanticForm.Input required label={this.getObject('phone')[lan]} id="phone" onChange={this.handleOnChange} />
          </SemanticForm.Group>
          <SemanticForm.Group>
            <Popup
              flowing
              on="click"
              position="top left"
              open={this.state.open}
              onClose={this.toggleDatePicker}
              onOpen={this.toggleDatePicker}
              trigger={
                <SemanticForm.Input
                  required
                  width={5}
                  label={this.getObject('dates')[lan]}
                  icon="calendar alternate outline"
                  id="dates"
                  readOnly
                  value={dateValue}
                />
                 }
              content={
                <React.Fragment>
                  <DayPicker
                    localeUtils={MomentLocaleUtils}
                    locale={lan}
                    numberOfMonths={2}
                    fromMonth={new Date()}
                    className="Selectable"
                    onDayClick={this.handleDayClick}
                    modifiers={modifiers}
                    selectedDays={[from, { from, to }]}
                    disabledDays={[{ before: new Date() }, new Date(2018, 6, 28)]}
                  />
                  <p><Label style={{ backgroundColor: '#c2e2b3', margin: '0 12px 0 20px' }} size="large" circular empty />
                    {lan === 'fi' ? 'Varattavissa oleva päivä' : 'Available for booking'}
                  </p>
                </React.Fragment>
                 }
            />
            <SemanticForm.Select
              label={from ? `${this.getObject('arrivalTime')[lan]} ${moment(from).format('DD.MM.YYYY')}` : this.getObject('arrivalTime')[lan]}
              width={4}
              compact
              required
              disabled={this.state.type !== 'company'}
              placeholder="hh:mm"
              options={timeOptions}
              id="arrivalTime"
              onChange={this.handleOnChange}
            />
            <SemanticForm.Select
              label={to ? `${this.getObject('departTime')[lan]} ${moment(to).format('DD.MM.YYYY')}` : `${this.getObject('departTime')[lan]} ${dateValue}`}
              width={4}
              compact
              required
              disabled={this.state.type !== 'company'}
              placeholder="hh:mm"
              options={timeOptions}
              id="departTime"
              onChange={this.handleOnChange}
            />
            <SemanticForm.Input
              type="number"
              label={this.getObject('personAmount')[lan]}
              width={3}
              min="1"
              required
              id="personAmount"
              value={this.state.personAmount}
              onChange={this.handleOnChange}
            />

          </SemanticForm.Group>
          <Header as="h4">{this.getObject('clientTypeTitle')[lan]} <sup style={{ color: 'red', fontSize: '14px' }}>*</sup></Header>
          <SemanticForm.Group inline>
            <SemanticForm.Radio style={{ paddingRight: '26px', fontSize: '16px' }} label={this.getObject('company')[lan]} value="company" checked={this.state.type === 'company'} onChange={(e, data) => this.handleOnRadioChange(e, data, 'type')} />
            <SemanticForm.Radio style={{ fontSize: '16px' }} label={this.getObject('private')[lan]} value="private" checked={this.state.type === 'private'} onChange={(e, data) => this.handleOnRadioChange(e, data, 'type')} />
          </SemanticForm.Group>

          { (this.state.errors.personAmountError || this.state.errors.mandatoryFields) &&
            <Message negative>
              <Message.List>
                {Object.values(this.state.errors).map(e =>
                  e && <Message.Item>{e}</Message.Item>)}
              </Message.List>
            </Message>
            }
          { this.state.type === 'company' &&
            <CompanyForm
              getObject={this.getObject}
              handleOnChange={this.handleOnChange}
              handleOnRadioChange={this.handleOnRadioChange}
              values={this.state}
              showInfo={this.showInfo}
            /> }
          { this.state.type === 'private' &&
            <PrivatePersonForm
              getObject={this.getObject}
              handleOnChange={this.handleOnChange}
              handleOnRadioChange={this.handleOnRadioChange}
              values={this.state}
            /> }
          { this.state.type &&
            <Extras
              getObject={this.getObject}
              showInfo={this.showInfo}
              values={this.state}
              handleOnChange={this.handleOnChange}
            />
        }
          <Header as="h4" dividing>{this.getObject('priceTitle')[lan]}</Header>
          {lan === 'fi' ?
            <p>
              {`Hinta sisältäen tilavarauksen, siivouksen${this.state.linen ? ', liinavaatteet' : ''}${this.state.towels ? ', pyyhkeet' : ''}${this.state.hottub ? ', paljun' : ''}:
              ${this.calculatePrice()} €`}<br />Tarjoilujen ja lisäpalveluiden hinnat määräytyvät saatavuuden mukaan
            </p>
          :
            <p>
              {`Price including accommodation, cleaning${this.state.linen ? ', linen' : ''}${this.state.linen ? ', towels' : ''}${this.state.hottub ? ', hot tub' : ''}:
            ${this.calculatePrice()} €`}<br />Food and other extra service prices depend on availability
            </p>
          }
          <SemanticForm.Button primary content={lan === 'fi' ? 'Lähetä' : 'Send'} onClick={this.sendMail} />
        </SemanticForm>
      </Container>
    );
  }
}

export default Form;

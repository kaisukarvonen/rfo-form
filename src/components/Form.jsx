import React from 'react';
import { Container, Header, Form as SemanticForm, Popup, Label, Message } from 'semantic-ui-react';
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
    disabledDays: [],
    partyAvailableDays: [],
  };

  componentDidMount = () => {
    getCalendarEvents().then((response) => {
      console.log(response.data.items);
      // TODO: list items in disabled, partly available lists
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
      if (data.value === 'private') {
        newState = { ...newState, departTime: '12', arrivalTime: '16' };
      }
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
      let { arrivalTime, departTime } = this.state;
      if (this.state.type !== 'company') {
        arrivalTime = '16';
        departTime = '12';
      }
      this.setState({ to, from, arrivalTime, departTime });
    }
  }

  foodOptions = (key) => {
    const object = this.getObject(key);
    const number = object.options ? object.options.length : '';
    return lan === 'fi' ? `${number} vaihtoehtoa` : `${number} options`;
  }

  calculatePrice = () => {
    // alvPrice
    let priceField = this.state.type === 'company' ? 'price' : 'alvPrice';
    let price = 0;
    const { linen, towels, hottub, meetingType, visitType } = this.state;
    price = meetingType ? this.getObjectInList('meetingOptions', this.state.meetingType).price : 0;
    price += (linen ? this.getObject('linen')[priceField] * this.state.personAmount : 0) +
    (towels ? this.getObject('towels')[priceField] * this.state.personAmount : 0) +
    (hottub ? this.getObject('hottub')[priceField] : 0);
    this.getObject('rentalEquipment').options.forEach((option) => {
      price += this.state[option.key] ? option.alvPrice : 0;
    });
    if (visitType !== 'meeting') {
      // TODO: calculate days
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
    const food = { title: 'Tarjoilut' };
    this.getObject('foodOptions').options.forEach((ac) => {
      food[this.getObjectInList('foodOptions', ac.key).fi] = data[ac.key] ? 'Kyllä' : undefined;
    });
    const activities = { title: 'Aktiviteetit ja ohjelmat' };
    this.getObject('activityOptions').options.forEach((ac) => {
      if (data[ac.key]) {
        activities[this.getObjectInList('activityOptions', ac.key).fi] = 'Kyllä';
      }
    });
    this.getObject('rentalOptions').options.forEach((rental) => {
      food[this.getObjectInList('rentalOptions', rental.key).fi] = data[rental.key] ? 'Kyllä' : undefined;
    });
    const services = ['linen', 'towels', 'hottub'];
    const extraServices = { title: 'Lisäpalvelut' };
    services.forEach((s) => { extraServices[this.getObject(s).fi] = data[s] ? 'Kyllä' : undefined; });

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

    // lisää tähän kokousvälineet, kaikki ohjelmat
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
      if (this.state.type !== 'company') {
        return moment(to).diff(moment(from), 'days') !== 0 ? `${moment(from).format('DD.MM.YYYY')} - ${moment(to).format('DD.MM.YYYY')}` :
        `${moment(from).format('DD.MM.YYYY')} - ${moment(from).add(1, 'days').format('DD.MM.YYYY')}`;
      }
      return moment(to).diff(moment(from), 'days') !== 0 ? `${moment(from).format('DD.MM.YYYY')} - ${moment(to).format('DD.MM.YYYY')}` : moment(from).format('DD.MM.YYYY');
    } else if (from && !to) {
      if (this.state.type !== 'company') {
        return `${moment(from).format('DD.MM.YYYY')} - ${moment(from).add(1, 'days').format('DD.MM.YYYY')}`;
      }
      return moment(from).format('DD.MM.YYYY');
    }
    return '';
  }


  showInfo = (object) => {
    const infoField = lan === 'fi' ? 'infoFi' : 'infoEn';
    return object[infoField];
  }


  render() {
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
                  <p>
                    <Label style={{ backgroundColor: '#c2e2b3', margin: '0 12px 0 20px' }} size="large" circular empty />{lan === 'fi' ? 'Vapaa' : 'Available'}
                    <Label style={{ backgroundColor: '#c2e2b3', margin: '0 12px 0 20px' }} size="large" circular empty />{lan === 'fi' ? 'Osittain vapaa' : 'Partly available'}
                  </p>
                </React.Fragment>
                 }
            />
            <SemanticForm.Select
              label={this.getObject('arrivalTime')[lan]}
              width={4}
              compact
              required
              style={{ pointerEvents: this.state.type === 'company' ? 'auto' : 'none' }}
              placeholder="hh:mm"
              options={timeOptions}
              value={this.state.arrivalTime}
              id="arrivalTime"
              onChange={this.handleOnChange}
            />
            <SemanticForm.Select
              label={this.getObject('departTime')[lan]}
              width={4}
              compact
              required
              style={{ pointerEvents: this.state.type === 'company' ? 'auto' : 'none' }}
              placeholder="hh:mm"
              options={timeOptions}
              value={this.state.departTime}
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

          <Message>
            <Message.Content>
              { lan === 'fi' ? `Tilavuokra Villa Paratiisissa on ensimmäiseltä yöltä ${this.getObject('acommodationPrices')['1']}€ ja seuraavilta ${this.getObject('acommodationPrices')['2']}€.
              Hinta sisältää klo 16-12 välisen oleskelun.`
                    :
                    `Accommodation price in Villa Paratiisi is for the first night ${this.getObject('acommodationPrices')['1']}€ and for all following ${this.getObject('acommodationPrices')['2']}€. Price includes stay from 16 to 12 o'clock.`
                  }
            </Message.Content>
          </Message>

          <Header as="h4">{this.getObject('clientTypeTitle')[lan]} <sup style={{ color: '#db2828', fontSize: '14px' }}>*</sup></Header>
          <SemanticForm.Group inline>
            <SemanticForm.Radio style={{ paddingRight: '26px' }} label={this.getObject('company')[lan]} value="company" checked={this.state.type === 'company'} onChange={(e, data) => this.handleOnRadioChange(e, data, 'type')} />
            <SemanticForm.Radio label={this.getObject('private')[lan]} value="private" checked={this.state.type === 'private'} onChange={(e, data) => this.handleOnRadioChange(e, data, 'type')} />
          </SemanticForm.Group>

          { this.state.errors.mandatoryFields &&
            <Message negative>
              <Message.Content>
                {this.state.errors.mandatoryFields}
              </Message.Content>
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
          { this.state.errors.personAmountError &&
          <Message negative>
            <Message.Content>
              {this.state.errors.personAmountError}
            </Message.Content>
          </Message>
              }
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
              {`Hinta sisältäen tilavarauksen, siivouksen, valitut vuokravälineet${this.state.linen ? ', liinavaatteet' : ''}${this.state.towels ? ', pyyhkeet' : ''}${this.state.hottub ? ', paljun' : ''}:
              ${this.calculatePrice()} €`}<br />Tarjoilujen ja lisäpalveluiden hinnat määräytyvät saatavuuden mukaan
            </p>
          :
            <p>
              {`Price including accommodation, cleaning, chosen rental equipments${this.state.linen ? ', linen' : ''}${this.state.linen ? ', towels' : ''}${this.state.hottub ? ', hot tub' : ''}:
            ${this.calculatePrice()} €`}<br />Food and other extra service prices depend on availability
            </p>
          }
          { this.state.type &&
            <Message>
              <Message.Content>
                { this.getObject('paymentInfo')[this.state.type][lan] }
              </Message.Content>
            </Message>}
          <SemanticForm.Button primary content={lan === 'fi' ? 'Lähetä' : 'Send'} onClick={this.sendMail} />
        </SemanticForm>
      </Container>
    );
  }
}

export default Form;

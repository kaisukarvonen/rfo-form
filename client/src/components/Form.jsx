import React from 'react';
import { Container, Header, Form as SemanticForm, Popup, Label, Message } from 'semantic-ui-react';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import 'moment/locale/fi';
import moment from 'moment';
import CompanyForm from './CompanyForm';
import Extras from './Extras';
import PrivatePersonForm from './PrivatePersonForm';
import createHTML from './Template';
import { lan, getCalendarEvents, formatDates } from '../utils';

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
    specialDates: [{ date: 24, month: 12 }, { date: 31, month: 12 }],
    moreInformation: ''
  };

  componentDidMount = () => {
    getCalendarEvents().then(response => {
      const { disabledDays, from16, until12 } = formatDates(response.data.items);
      this.setState({
        disabledDays,
        availableFrom16: from16,
        availableUntil12: until12
      });
    });
    this.setState({
      cottages: new Array(this.getObjectInList('extraPersons', 'cottage').choices.length).fill(false)
    });
  };

  getTimeOptions = () => {
    const times = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
    const options = [];
    times.forEach(hour => {
      options.push({ key: hour, value: hour, text: `${hour}:00` });
    });
    return options;
  };

  getObject = key => this.props.fields.find(field => field.key === key);
  getObjectInList = (key, innerKey) => this.getObject(key).options.find(option => option.key === innerKey);

  handleOnChange = (e, data) => {
    this.setState({
      [data.id]: data.type === 'checkbox' ? data.checked : data.value,
      visitType: data.id === 'visitTypeString' ? undefined : this.state.visitType
    });
  };

  handleCottageChange = (e, data) => {
    const cottages = [...this.state.cottages];
    cottages.splice(data.id - 1, 1, data.checked);
    this.setState({ cottages });
  };

  handleOnRadioChange = (e, data, id) => {
    let newState = {};
    const values = {
      locationType: undefined,
      meetingType: undefined,
      visitTypeString: ''
    };
    if (id === 'type' && this.state.type !== data.value) {
      newState = {
        ...values,
        visitType: undefined,
        companyName: '',
        errors: { ...this.state.errors }
      };
      if (data.value === 'private') {
        newState = { ...newState, departTime: '12', arrivalTime: '16' };
      }
    } else if (id === 'visitType' && this.state.visitType !== data.value) {
      newState = values;
    }
    this.setState({ [id]: data.value, ...newState });
  };

  toggleDatePicker = () => {
    this.setState({ popupOpen: !this.state.popupOpen });
  };

  handleDayClick = (day, modifiers) => {
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
      this.setState({
        to,
        from,
        arrivalTime,
        departTime,
        until12Info: modifiers.availableUntil12,
        from16Info: modifiers.availableFrom16
      });
    }
  };

  foodOptions = key => {
    const object = this.getObject(key);
    const number = object.options ? object.options.length : '';
    return lan === 'fi' ? `${number} vaihtoehtoa` : `${number} options`;
  };

  calculatePrice = () => {
    // alvPrice
    const priceField = this.state.type === 'company' ? 'price' : 'alvPrice';
    let price = 0;
    const { linen, towels, hottub, meetingType, to, from, type, cottages, cleaning, specialDates, petFee, laavu } = this.state;

    price = meetingType ? this.getObjectInList('meetingOptions', this.state.meetingType).price : 0;
    price +=
      (linen ? this.getObject('linen')[priceField] * this.state.personAmount : 0) +
      (towels ? this.getObject('towels')[priceField] * this.state.personAmount : 0) +
      (petFee ? this.getObject('petFee')[priceField] : 0) +
      (laavu ? this.getObject('laavu')[priceField] : 0) +
      (hottub ? this.getObject('hottub')[priceField] : 0);
    this.getObject('rentalEquipment').options.forEach(option => {
      price += this.state[option.key] ? option[priceField] || option.alvPrice : 0;
    });
    let activePeriod = '';
    if (type !== 'company' && (to || from)) {
      let numOfNights = 1;
      if (from && to) {
        numOfNights = moment(to).diff(moment(from), 'days');
      }
      activePeriod = [9, 10, 11, 0, 1, 2, 3].includes(from.getMonth()) ? 'winter' : 'summer';
      const strFrom = { date: from.getDate(), month: from.getMonth() + 1 };
      specialDates.forEach(date => {
        if (JSON.stringify(date) === JSON.stringify(strFrom)) {
          // for special dates summer peak prices are valid
          activePeriod = 'summer';
        }
      });
      price +=
        numOfNights < 2
          ? this.getObject('acommodationPrices')[activePeriod]['1']
          : this.getObject('acommodationPrices')[activePeriod]['1'] + (numOfNights - 1) * this.getObject('acommodationPrices')[activePeriod]['2'];
      const numOfCottages = cottages.filter(Boolean).length;
      price += cleaning
        ? activePeriod === 'summer'
          ? this.getObject('cleaning').summer
          : this.getObject('cleaning').winter.villa + this.getObject('cleaning').winter.cottage * numOfCottages
        : 0;
      this.getObject('extraPersons').options.forEach(o => {
        if (o.key === 'cottage') {
          price += numOfCottages > 0 && activePeriod !== 'summer' ? o.price * numOfNights * numOfCottages : 0;
        } else {
          price += this.state[o.key] ? o.price * numOfNights : 0;
        }
      });
    }
    return price;
  };

  isValid = () => {
    const date = this.state.to || this.state.from;
    const mandatoryFields = [
      this.state.name,
      this.state.email,
      date,
      this.state.arrivalTime,
      this.state.departTime,
      this.state.personAmount,
      this.state.type
    ];
    if (!mandatoryFields.includes('') && !mandatoryFields.includes(undefined)) {
      this.setState({
        errors: { ...this.state.errors, mandatoryFields: undefined }
      });
      return true;
    }
    return false;
  };

  sendMail = () => {
    if (this.isValid()) {
      const strDates = this.dateToStr(this.state.from, this.state.to);
      const title = `Tarjouspyyntö ${strDates}`;
      let description = `Tarjouspyyntö ajalle ${strDates} henkilöltä ${this.state.name} `;
      const html = createHTML(this.createDataFields(), title, description, this.state.moreInformation);
      this.props.sendMail(this.state.email, title, html);
    } else {
      this.setState({
        errors: {
          ...this.state.errors,
          mandatoryFields: 'Täytä pakolliset kentät!'
        }
      });
    }
    window.scrollTo(0, 0);
  };

  createDataFields = () => {
    const data = this.state;
    const basicInfo = {
      title: this.getObject('contactDetails').fi,
      [this.getObject('name').fi]: data.name,
      [this.getObject('email').fi]: data.email,
      [this.getObject('phone').fi]: data.phone,
      [this.getObject('address').fi]: data.address,
      [this.getObject('dates').fi]: this.dateToStr(data.from, data.to),
      [this.getObject('arrivalTime').fi]: `klo ${data.arrivalTime}`,
      [this.getObject('departTime').fi]: `klo ${data.departTime}`,
      [this.getObject('personAmount').fi]: data.personAmount,
      Asiakastyyppi: this.getObject(data.type).fi,
      Hinta: `${this.calculatePrice()} €`
    };
    const extraPersons = { title: 'Lisähenkilöt' };
    this.getObject('extraPersons').options.forEach(ac => {
      if (ac.key === 'cottage') {
        let cottages = '';
        data.cottages.forEach((val, i) => {
          if (val) {
            cottages += `${ac.choices[i]} hlön huone, `;
          }
        });
        extraPersons['Huoneet mökissä'] = !!cottages ? cottages : undefined;
      } else {
        extraPersons[ac.fi] = !!data[ac.key];
      }
    });

    const food = { title: 'Tarjoilut' };
    this.getObject('foodOptions').options.forEach(ac => {
      food[this.getObjectInList('foodOptions', ac.key).fi] = !!data[ac.key];
    });

    const activities = { title: 'Aktiviteetit ja ohjelmat' };
    this.getObject('allYearRound').options.forEach(ac => {
      activities[this.getObjectInList('allYearRound', ac.key).fi] = !!data[ac.key];
    });
    this.getObject('summer').options.forEach(ac => {
      activities[this.getObjectInList('summer', ac.key).fi] = !!data[ac.key];
    });
    this.getObject('winter').options.forEach(ac => {
      activities[this.getObjectInList('winter', ac.key).fi] = !!data[ac.key];
    });

    this.getObject('rentalEquipment').options.forEach(rental => {
      activities[this.getObjectInList('rentalEquipment', rental.key).fi] = !!data[rental.key];
    });

    const services = ['linen', 'towels', 'hottub', 'cleaning', 'laavu', 'petFee'];
    const extraServices = { title: 'Lisäpalvelut' };
    services.forEach(s => {
      extraServices[this.getObject(s).fi] = !!data[s];
    });
    this.getObject('meetingEquipment').options.forEach(ac => {
      extraServices[this.getObjectInList('meetingEquipment', ac.key).fi] = !!data[ac.key];
    });

    const visitDetails = { title: 'Vierailun lisätiedot' };
    const details = ['companyName', 'visitType', 'visitTypeString', 'meetingType', 'locationType', 'recreationType'];
    details.forEach(d => {
      if (data[d]) {
        if (d === 'meetingType') {
          const object = this.getObjectInList('meetingOptions', data[d]);
          visitDetails['Kokouksen tyyppi'] = `${object.fi} - ${object.duration}h`;
        } else if (d === 'recreationType') {
          const object = this.getObjectInList('recreationOptions', data[d]);
          visitDetails['Virkistyspäivän tyyppi'] = `${object.fi} - ${object.duration}h`;
        } else if (d === 'visitType') {
          visitDetails['Vierailun tyyppi'] = this.getObject(data.visitType).fi;
        } else if (d === 'visitTypeString') {
          visitDetails['Vierailun tyyppi'] = data.visitTypeString;
        } else if (d === 'locationType') {
          visitDetails.Tilat = this.getObject(data[d]).fi;
        } else {
          visitDetails[this.getObject(d).fi] = data[d];
        }
      }
    });
    return {
      basicInfo,
      food,
      extraPersons,
      activities,
      extraServices,
      visitDetails
    };
  };

  dateToStr = (from, to) => {
    if (from && to) {
      const diff = moment(to).diff(moment(from), 'days');
      if (this.state.type !== 'company') {
        return diff !== 0
          ? `${moment(from).format('DD.MM.YYYY')} - ${moment(to).format('DD.MM.YYYY')}`
          : `${moment(from).format('DD.MM.YYYY')} - ${moment(from)
              .add(1, 'days')
              .format('DD.MM.YYYY')}`;
      }
      return diff !== 0 ? `${moment(from).format('DD.MM.YYYY')} - ${moment(to).format('DD.MM.YYYY')}` : moment(from).format('DD.MM.YYYY');
    } else if (from && !to) {
      if (this.state.type !== 'company') {
        return `${moment(from).format('DD.MM.YYYY')} - ${moment(from)
          .add(1, 'days')
          .format('DD.MM.YYYY')}`;
      }
      return moment(from).format('DD.MM.YYYY');
    }
    return '';
  };

  showInfo = object => {
    let info = object.infoFi;
    if (info && info.includes('*s_link*')) {
      const link = '*s_link*';
      const address = info.substring(info.indexOf(link) + link.length, info.indexOf('*e_link*'));
      const linkName = info.substring(info.indexOf('*s_text*') + link.length, info.indexOf('*e_text*'));
      info = (
        <span>
          {info.substring(0, info.indexOf(link))}
          <a href={address.includes('http') ? address : `http://${address}`} target="blank">
            {linkName}
          </a>
          {info.substring(info.indexOf('*e_text*') + link.length)}
        </span>
      );
    }
    return info;
  };

  render() {
    const { from, to } = this.state;
    const modifiers = {
      start: from,
      end: to,
      availableUntil12: this.state.availableUntil12,
      availableFrom16: this.state.availableFrom16
    };
    const dateValue = this.dateToStr(from, to);
    const timeOptions = this.getTimeOptions();
    return (
      <React.Fragment>
        <div className="site-header">
          <h3 className="header-title">Tarjouspyyntö - Nuuksion Taika</h3>
          <p>
            <a href="https://www.nuuksiontaika.fi/">Takaisin Nuuksion Taian sivuille</a>
          </p>
        </div>
        <Container style={{ marginTop: '20px' }}>
          <SemanticForm style={{ margin: '0 5%' }} noValidate="novalidate">
            <Header as="h4" dividing>
              {this.getObject('contactDetails').fi}
            </Header>
            <SemanticForm.Group widths="equal">
              <SemanticForm.Input required label={this.getObject('name').fi} id="name" onChange={this.handleOnChange} />
              <SemanticForm.Input required label={this.getObject('email').fi} id="email" onChange={this.handleOnChange} />
            </SemanticForm.Group>
            <SemanticForm.Group widths="equal">
              <SemanticForm.Input label={this.getObject('phone').fi} id="phone" onChange={this.handleOnChange} />
              <SemanticForm.Input label={this.getObject('address').fi} id="address" onChange={this.handleOnChange} />
            </SemanticForm.Group>
            {this.state.type && (
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
                      label={this.getObject('dates').fi}
                      icon="calendar alternate outline"
                      id="dates"
                      value={dateValue}
                    />
                  }
                  content={
                    <React.Fragment>
                      <DayPicker
                        localeUtils={MomentLocaleUtils}
                        locale={'fi'}
                        numberOfMonths={2}
                        fromMonth={new Date()}
                        className="Selectable"
                        onDayClick={this.handleDayClick}
                        modifiers={modifiers}
                        selectedDays={[from, { from, to }]}
                        disabledDays={[{ before: new Date() }, ...this.state.disabledDays]}
                      />
                      <div style={{ margin: '0 0 0 20px' }}>
                        {this.state.until12Info && <p>Vapaa klo 12 asti</p>}
                        {this.state.from16Info && <p>Vapaa klo 16 alkaen</p>}
                        <Label
                          style={{
                            backgroundColor: '#c2e2b3',
                            margin: '0 8px 0 0'
                          }}
                          size="large"
                          circular
                          empty
                        />
                        Vapaa
                        <Label
                          style={{
                            backgroundColor: '#ffc107',
                            margin: '0 8px'
                          }}
                          size="large"
                          circular
                          empty
                        />
                        Osittain vapaa
                      </div>
                    </React.Fragment>
                  }
                />
                <SemanticForm.Select
                  label={this.getObject('arrivalTime').fi}
                  width={4}
                  compact
                  required
                  style={{
                    pointerEvents: this.state.type === 'company' ? 'auto' : 'none'
                  }}
                  placeholder="hh:mm"
                  options={timeOptions}
                  value={this.state.arrivalTime}
                  id="arrivalTime"
                  onChange={this.handleOnChange}
                />
                <SemanticForm.Select
                  label={this.getObject('departTime').fi}
                  width={4}
                  compact
                  required
                  style={{
                    pointerEvents: this.state.type === 'company' ? 'auto' : 'none'
                  }}
                  placeholder="hh:mm"
                  options={timeOptions}
                  value={this.state.departTime}
                  id="departTime"
                  onChange={this.handleOnChange}
                />
                <SemanticForm.Input
                  type="number"
                  label={this.getObject('personAmount').fi}
                  width={3}
                  min="1"
                  required
                  id="personAmount"
                  value={this.state.personAmount}
                  onChange={this.handleOnChange}
                />
              </SemanticForm.Group>
            )}
            {this.state.type === 'private' && (
              <React.Fragment>
                <Message>
                  <Message.Content>{this.getObject('acommodationInfo').summer.fi}</Message.Content>
                </Message>
                <Message>
                  <Message.Content>{this.getObject('acommodationInfo').winter.fi}</Message.Content>
                </Message>
              </React.Fragment>
            )}
            <Header as="h4">
              {this.getObject('clientTypeTitle').fi} <sup style={{ color: '#db2828', fontSize: '14px' }}>*</sup>
            </Header>
            <SemanticForm.Group inline>
              <SemanticForm.Radio
                style={{ paddingRight: '26px' }}
                label={this.getObject('company').fi}
                value="company"
                checked={this.state.type === 'company'}
                onChange={(e, data) => this.handleOnRadioChange(e, data, 'type')}
              />
              <SemanticForm.Radio
                label={this.getObject('private').fi}
                value="private"
                checked={this.state.type === 'private'}
                onChange={(e, data) => this.handleOnRadioChange(e, data, 'type')}
              />
            </SemanticForm.Group>

            {this.state.errors.mandatoryFields && (
              <Message negative>
                <Message.Content>{this.state.errors.mandatoryFields}</Message.Content>
              </Message>
            )}
            {this.state.type === 'company' && (
              <CompanyForm
                getObject={this.getObject}
                handleOnChange={this.handleOnChange}
                handleOnRadioChange={this.handleOnRadioChange}
                values={this.state}
                showInfo={this.showInfo}
              />
            )}
            {this.state.type === 'private' && (
              <PrivatePersonForm
                getObject={this.getObject}
                handleOnChange={this.handleOnChange}
                handleOnRadioChange={this.handleOnRadioChange}
                values={this.state}
                handleCottageChange={this.handleCottageChange}
              />
            )}
            {this.state.type && (
              <Extras getObject={this.getObject} showInfo={this.showInfo} values={this.state} handleOnChange={this.handleOnChange} />
            )}

            <SemanticForm>
              <SemanticForm.TextArea
                rows={3}
                autoHeight
                label={'Lisätietoja tarjouspyyntöön'}
                value={this.moreInformation}
                id="moreInformation"
                onChange={this.handleOnChange}
              />
            </SemanticForm>

            <Header as="h4" dividing>
              {this.getObject('priceTitle').fi}
            </Header>
            <p>
              {`Alustava hinta sisältäen valitut palvelut: ${this.calculatePrice()} €`}
              <br />
              Tarjoilujen ja ohjelmien hinnat määräytyvät saatavuuden mukaan. Pidätämme oikeuden muutoksiin.
            </p>
            {this.state.type && (
              <Message>
                <Message.Content>{this.getObject('paymentInfo')[this.state.type].fi}</Message.Content>
              </Message>
            )}
            <SemanticForm.Button primary content={'Lähetä'} onClick={this.sendMail} />
          </SemanticForm>
        </Container>
      </React.Fragment>
    );
  }
}

export default Form;

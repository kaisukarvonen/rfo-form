import React from 'react';
import { Container, Header, Form as SemanticForm, Popup, Icon, Grid } from 'semantic-ui-react';
import _ from 'lodash';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import 'moment/locale/fi';
import moment from 'moment';
import CompanyForm from './CompanyForm';
import PrivatePersonForm from './PrivatePersonForm';
import lan from '../utils';

class Form extends React.Component {
  state = {
    type: undefined,
    popupOpen: false,
    from: undefined,
    to: undefined,
    lunch: false,
    personAmount: 1,
  };

  getTimeOptions = () => {
    const times = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
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
      newState = { ...values, visitType: undefined, companyName: '' };
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
    let dateValue = '';
    if (from && to) {
      dateValue = moment(to).diff(moment(from), 'days') !== 0 ? `${moment(from).format('DD.MM.YYYY')} - ${moment(to).format('DD.MM.YYYY')}` : moment(from).format('DD.MM.YYYY');
    } else if (from && !to) {
      dateValue = moment(from).format('DD.MM.YYYY');
    }
    const timeOptions = this.getTimeOptions();
    return (
      <Container style={{ padding: '20px 0 20px 0' }}>
        <SemanticForm style={{ maxWidth: '900px' }}>
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
                  width={7}
                  label={this.getObject('dates')[lan]}
                  icon="calendar alternate outline"
                  id="dates"
                  onChange={this.handleOnChange}
                  value={dateValue}
                />
                 }
              content={
                <React.Fragment>
                  <DayPicker
                  localeUtils={MomentLocaleUtils}
                  locale={lan}
                  numberOfMonths={2}
                  className="Selectable"
                  onDayClick={this.handleDayClick}
                  modifiers={modifiers}
                  selectedDays={[from, { from, to }]}
                  disabledDays={{ before: new Date() }}
                />
                <p>dfdf</p>
              </React.Fragment>
                 }
            />
            <SemanticForm.Select
              label={from ? `${this.getObject('arrivalTime')[lan]} ${moment(from).format('DD.MM.YYYY')}` : this.getObject('arrivalTime')[lan]}
              width={3}
              compact
              required
              placeholder="hh:mm"
              options={timeOptions}
              id="arrivalTime"
              onChange={this.handleOnChange}
            />
            <SemanticForm.Select
              label={to ? `${this.getObject('departTime')[lan]} ${moment(to).format('DD.MM.YYYY')}` : `${this.getObject('departTime')[lan]} ${dateValue}`}
              width={3}
              compact
              required
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
          <Header as="h4">{this.getObject('clientTypeTitle')[lan]}</Header>
          <SemanticForm.Group inline>
            <SemanticForm.Radio style={{ paddingRight: '26px', fontSize: '16px' }} label={this.getObject('company')[lan]} value="company" checked={this.state.type === 'company'} onChange={(e, data) => this.handleOnRadioChange(e, data, 'type')} />
            <SemanticForm.Radio style={{ fontSize: '16px' }} label={this.getObject('private')[lan]} value="private" checked={this.state.type === 'private'} onChange={(e, data) => this.handleOnRadioChange(e, data, 'type')} />
          </SemanticForm.Group>
          { this.state.type === 'company' &&
            <CompanyForm
              getObject={this.getObject}
              handleOnChange={this.handleOnChange}
              handleOnRadioChange={this.handleOnRadioChange}
              values={this.state}
            /> }
          { this.state.type === 'private' &&
            <PrivatePersonForm
              getObject={this.getObject}
              handleOnChange={this.handleOnChange}
              handleOnRadioChange={this.handleOnRadioChange}
              values={this.state}
            /> }
          <Header as="h4" dividing style={{ paddingTop: '0.5em' }}>{this.getObject('servicesTitle')[lan]}</Header>
          <Grid style={{ marginBottom: '1px' }}>
            <Grid.Column width={5}>
              <SemanticForm.Checkbox label={this.getObject('linen')[lan]} id="linen" onChange={this.handleOnChange} />
              <SemanticForm.Checkbox label={this.getObject('towels')[lan]} id="towels" onChange={this.handleOnChange} />
              <SemanticForm.Checkbox label={this.getObject('hottub')[lan]} id="hottub" onChange={this.handleOnChange} />
            </Grid.Column>
            <Grid.Column width={3}>
              <p>{this.getObject('linen').price} € + {lan === 'fi' ? 'alv' : 'vat'}</p>
              <p>{this.getObject('towels').price} € + {lan === 'fi' ? 'alv' : 'vat'}</p>
              <p>{this.getObject('hottub').price} € + {lan === 'fi' ? 'alv' : 'vat'}</p>
            </Grid.Column>
          </Grid>
          { this.state.type === 'company' && this.state.visitType === 'meeting' &&
          <p style={styles.categoryHeader} onClick={() => { this.setState({ showMeetingEquipment: !this.state.showMeetingEquipment }); }}>
              {this.getObject('meetingEquipment')[lan]}
            <Icon name="angle down" />
          </p>
            }
          { this.state.showMeetingEquipment &&
            <div style={styles.categoryItems}>
              {this.getObject('meetingEquipment').options.map(i =>
                <SemanticForm.Checkbox label={i[lan]} id={i.key} onChange={this.handleOnChange} />)}
            </div>}
          <Header as="h5">{this.getObject('foodService')[lan]}</Header>
          <SemanticForm.Checkbox label={this.getObject('breakfastCoffee')[lan]} id="breakfastCoffee" onChange={this.handleOnChange} />
          <SemanticForm.Checkbox label={this.getObject('breakfast')[lan]} id="breakfast" onChange={this.handleOnChange} />
          <SemanticForm.Group inline>
            <SemanticForm.Checkbox label={this.getObject('lunch')[lan]} id="lunch" checked={this.state.lunch} onChange={this.handleOnChange} />
            <p style={styles.categoryHeader} onClick={() => { this.setState({ lunch: !this.state.lunch }); }}><Icon name="angle down" /> {this.foodOptions('lunch')}</p>
          </SemanticForm.Group>
          {this.state.lunch &&
            <div style={styles.categoryItems}>
              { this.getObject('lunch').options.map(i =>
                <SemanticForm.Radio label={i[lan]} value={i.key} checked={this.state.lunchType === i.key} onChange={(e, data) => this.handleOnRadioChange(e, data, 'lunchType')} />)}
            </div>
          }
          <SemanticForm.Checkbox label={this.getObject('nokipannu')[lan]} id="nokipannu" onChange={this.handleOnChange} />
          <SemanticForm.Checkbox label={this.getObject('dessert')[lan]} id="dessert" onChange={this.handleOnChange} />
          <SemanticForm.Group inline>
            <SemanticForm.Checkbox label={this.getObject('dinner')[lan]} id="dinner" checked={this.state.dinner} onChange={this.handleOnChange} />
            <p style={styles.categoryHeader} onClick={() => { this.setState({ dinner: !this.state.dinner }); }}><Icon name="angle down" /> {this.foodOptions('dinner')}</p>
          </SemanticForm.Group>
          {this.state.dinner &&
            <div style={styles.categoryItems}>
              {this.getObject('dinner').options.map(i =>
                <SemanticForm.Radio label={i[lan]} value={i.key} checked={this.state.dinnerType === i.key} onChange={(e, data) => this.handleOnRadioChange(e, data, 'dinnerType')} />)}
            </div>
          }
          <SemanticForm.Checkbox label={this.getObject('supper')[lan]} id="supper" onChange={this.handleOnChange} />
          <SemanticForm.TextArea rows={2} autoHeight label={this.getObject('allergies')[lan]} id="allergies" onChange={this.handleOnChange} width={10} />
          <Header as="h5">{this.getObject('activityTitle')[lan]}</Header>
          <p style={styles.categoryHeader} onClick={() => { this.setState({ showRental: !this.state.showRental }); }}>{this.getObject('rentalTitle')[lan]} <Icon name="angle down" /></p>
          {this.state.showRental &&
            <div style={styles.categoryItems}>
              {this.getObject('rentalTitle').options.map(i =>
                <SemanticForm.Checkbox label={i[lan]} id={i.key} onChange={this.handleOnChange} />)}
            </div>
          }
          { this.getObject('activityOptions').options.map(i =>
            <SemanticForm.Checkbox label={i[lan]} id={i.key} onChange={this.handleOnChange} />)
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
        </SemanticForm>
      </Container>
    );
  }
}

export default Form;

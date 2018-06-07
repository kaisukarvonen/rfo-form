import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Container, Header, Form, Popup, Icon, Grid } from 'semantic-ui-react';
import _ from 'lodash';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import 'moment/locale/fi';
import moment from 'moment';
import * as fieldActions from '../dux/fields';
import '../css/styles.css';
import '../css/DayPicker.css';
import CompanyForm from './CompanyForm';
import PrivatePersonForm from './PrivatePersonForm';


class App extends React.Component {
  state = {
    type: undefined,
    popupOpen: false,
    from: undefined,
    to: undefined,
    lunch: false,
  };

  componentWillMount = () => {
    const url = window.location;
    const searchParams = new URLSearchParams(url.search);
    this.props.fetchFields(searchParams.get('language'));
  }

  getTimeOptions = () => {
    const times = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    const options = [];
    times.forEach((hour) => {
      options.push({ key: hour, value: hour, text: `${hour}:00` });
    });
    return options;
  }

  getObject = key => _.find(this.props.fields, { key });

  handleOnChange = (e, data) => {
    this.setState({ [data.id]: data.type === 'checkbox' ? data.checked : data.value });
  }

  handleOnRadioChange = (e, data, id) => {
    this.setState({ [id]: data.value });
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


  render() {
    console.log(this.state.visitType);
    const styles = {
      categoryHeader: {
        cursor: 'pointer',
        width: '180px',
        marginTop: 0,
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
      this.props.fields ?
        <Container style={{ paddingTop: '20px' }}>
          <Form style={{ maxWidth: '900px' }}>
            <Header as="h4" dividing>Yhteystiedot</Header>
            <Form.Group widths="equal">
              <Form.Input label={this.getObject('name').value} />
              <Form.Input label="Sähköposti *" />
              <Form.Input label="Puhelin" />
            </Form.Group>
            <Form.Group>
              <Popup
                flowing
                on="click"
                position="top left"
                open={this.state.open}
                onClose={this.toggleDatePicker}
                onOpen={this.toggleDatePicker}
                trigger={
                  <Form.Input
                    width={7}
                    placeholder="Aikaväli"
                    label="Ajankohta *"
                    icon="calendar alternate outline"
                    name="date"
                    onChange={this.handleOnChange}
                    value={dateValue}
                  />
                 }
                content={
                  <DayPicker
                    localeUtils={MomentLocaleUtils}
                    locale="fi"
                    numberOfMonths={2}
                    className="Selectable"
                    onDayClick={this.handleDayClick}
                    modifiers={modifiers}
                    selectedDays={[from, { from, to }]}
                    disabledDays={{ before: new Date() }}
                  />
                 }
              />
              <Form.Select
                label={from ? `Tuloaika ${moment(from).format('DD.MM.YYYY')}` : 'Tuloaika'}
                width={3}
                compact
                placeholder="Kellonaika"
                options={timeOptions}
              />
              <Form.Select
                label={to ? `Lähtöaika ${moment(to).format('DD.MM.YYYY')}` : `Lähtöaika ${dateValue}`}
                width={3}
                compact
                placeholder="Kellonaika"
                options={timeOptions}
              />
              <Form.Input
                type="number"
                label="Henkilömäärä"
                width={3}
                min="1"
              />

            </Form.Group>
            <Header as="h4">Olen </Header>
            <Form.Group inline>
              <Form.Radio style={{ paddingRight: '26px', fontSize: '16px' }} label="Yritysasiakas" value="company" checked={this.state.type === 'company'} onChange={(e, data) => this.handleOnRadioChange(e, data, 'type')} />
              <Form.Radio style={{ fontSize: '16px' }} label="Yksityisasiakas" value="private" checked={this.state.type === 'private'} onChange={(e, data) => this.handleOnRadioChange(e, data, 'type')} />
            </Form.Group>
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
            <Header as="h4" dividing style={{ paddingTop: '0.5em' }}>Mitä lisäpalveluja tarvitset?</Header>
            <Grid style={{ marginBottom: '1px' }}>
              <Grid.Column width={5}>
                <Form.Checkbox label={this.getObject('linen').value} id="linen" onChange={this.handleOnChange} />
                <Form.Checkbox label={this.getObject('towels').value} id="towels" onChange={this.handleOnChange} />
                <Form.Checkbox label={this.getObject('hottub').value} id="hottub" onChange={this.handleOnChange} />
                <Form.Checkbox label={this.getObject('sauna').value} id="sauna" onChange={this.handleOnChange} />
              </Grid.Column>
              <Grid.Column width={3}>
                <p>{this.getObject('linen').price} € + alv</p>
                <p>{this.getObject('towels').price} € + alv</p>
                <p>{this.getObject('hottub').price} € + alv</p>
                <p>{this.getObject('sauna').price} € + alv</p>
              </Grid.Column>
            </Grid>
            { this.state.type === 'company' && this.state.visitType === 'meeting' &&
              <p style={styles.categoryHeader} onClick={() => { this.setState({ showMeetingEquipment: !this.state.showMeetingEquipment }); }}>
              Kokousvälineet
                <Icon name="angle down" />
              </p>
            }
            { this.state.showMeetingEquipment &&
            <div style={{ padding: '0 0 12px 12px' }}>
              <Form.Checkbox label="Kaapelit (HDMI, VGA)" />
              <Form.Checkbox label="Fläppitaulu" />
            </div>}
            <Header as="h5">Tarjoilut</Header>
            <Form.Checkbox label="Aamiaiskahvit" />
            <Form.Checkbox label="Aamiainen" />
            <Form.Group inline>
              <Form.Checkbox label="Lounas" id="lunch" checked={this.state.lunch} onChange={this.handleOnChange} />
              <p style={styles.categoryHeader} onClick={() => { this.setState({ lunch: !this.state.lunch }); }}><Icon name="angle down" /> (kolme vaihtoehtoa)</p>
            </Form.Group>
            {this.state.lunch &&
            <div style={{ padding: '0 0 12px 12px' }}>
              <Form.Radio label="Maahisten hirvimakkaroita ja talon omaa peruna-yrttisalaattia" />
              <Form.Radio label="Ilmattaren kermaista kasvis-, kala- tai riistakeittoa" />
              <Form.Radio label="Katajattaren metsäsieni- ja savuporotäytteisiä uuniperunoita" />
            </div>}
            <Form.Checkbox label="Nokipannukahvit" />
            <Form.Checkbox label="Leivonnainen" />
            <Form.Group inline>
              <Form.Checkbox label="Illallinen" id="dinner" checked={this.state.dinner} onChange={this.handleOnChange} />
              <p style={styles.categoryHeader} onClick={() => { this.setState({ dinner: !this.state.dinner }); }}><Icon name="angle down" /> (kolme vaihtoehtoa)</p>
            </Form.Group>
            {this.state.dinner &&
            <div style={{ padding: '0 0 12px 12px' }}>
              <Form.Radio label="x" />
            </div>}
            <Form.Checkbox label="Iltapala" />
            <Form.TextArea rows={2} autoHeight label="Mahdolliset ruoka-aineallergiat" width={10} />
            <Header as="h5">Aktiviteetit</Header>
            <p style={styles.categoryHeader} onClick={() => { this.setState({ showRental: !this.state.showRental }); }}>Vuokravälineet <Icon name="angle down" /></p>
            {this.state.showRental &&
            <div style={{ padding: '0 0 12px 12px' }}>
              <Form.Checkbox label="Sup-laudat" />
              <Form.Checkbox label="Kanootit" />
              <Form.Checkbox label="Potkukelkat" />
            </div>}
            <Form.Checkbox label="Kalliolaskeutuminen" />
            <Form.Checkbox label="Tiimikisailu" />
            <Form.Checkbox label="Kehon hoito (esim. jooga, kahvakuula, yrttikylpy)" />
            <Form.Checkbox label="Työyhteisökoulutus" />
            <Form.Checkbox label="Jurttasauna" />
            <Form.Checkbox label="Elävää musiikkia" />
            <Form.Checkbox label="Husky-retki kickbikella" />

            <Header as="h4" dividing>Alustava hinta</Header>
            <p>Hinta sis.*TODO* . Tarjoilujen ja aktiviteettien hinta määräytyy saatavuuden mukaan</p>
          </Form>
        </Container> :
        ''
    );
  }
}

export default connect(
  state => ({
    fields: state.fields,
  }),
  dispatch => (bindActionCreators({
    ...fieldActions,
  }, dispatch)),
)(App);

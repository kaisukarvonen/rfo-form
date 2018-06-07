import React from 'react';
import { Header, Form, Grid, Checkbox, Icon } from 'semantic-ui-react';
import InfoPopup from './InfoPopup';


class CompanyForm extends React.Component {
  state = { };

  render() {
    const { values } = this.props;
    return (
      <React.Fragment>
        <Header as="h4" dividing>Mikä on vierailusi tyyppi?</Header>
        <Form.Radio label={this.props.getObject('meeting').value} value="meeting" checked={values.visitType === 'meeting'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'visitType')} />
        <Form.Radio label={this.props.getObject('recreational').value} value="recreational" checked={values.visitType === 'recreational'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'visitType')} />
        <Form.Input width={8} label="Muu, mikä?" id="visitType" onChange={this.props.handleOnChange} />
        { values.visitType === 'meeting' &&
        <React.Fragment>
          <Header as="h4" dividing>Millaisen kokouksen haluat pitää?</Header>
          <Grid>
            <Grid.Column width={10}>
              <Form.Field inline>
                <Checkbox radio label={this.props.getObject('dayMeeting').value} value="dayMeeting" checked={values.meetingType === 'dayMeeting'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'meetingType')} />
                <InfoPopup icon="info circle" content={this.props.getObject('dayMeeting').info} />
              </Form.Field>
              <Form.Field inline>
                <Checkbox radio label={this.props.getObject('dayMeetingSauna').value} value="dayMeetingSauna" checked={values.meetingType === 'dayMeetingSauna'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'meetingType')} />
                <InfoPopup icon="info circle" content={this.props.getObject('dayMeetingSauna').info} />
              </Form.Field>
              <Form.Field inline>
                <Checkbox radio label={this.props.getObject('lunchToLunchAccommodation').value} value="lunchToLunchAccommodation" checked={values.meetingType === 'lunchToLunchAccommodation'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'meetingType')} />
                <InfoPopup icon="info circle" content={this.props.getObject('lunchToLunchAccommodation').info} />
              </Form.Field>
              <Form.Field inline>
                <Checkbox radio label={this.props.getObject('meetingAccommodation').value} value="meetingAccommodation" checked={values.meetingType === 'meetingAccommodation'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'meetingType')} />
                <InfoPopup icon="info circle" content={this.props.getObject('meetingAccommodation').info} />
              </Form.Field>
            </Grid.Column>
            <Grid.Column width={2}>
              <p>{this.props.getObject('dayMeeting').duration} h</p>
              <p>{this.props.getObject('dayMeetingSauna').duration} h</p>
              <p>{this.props.getObject('lunchToLunchAccommodation').duration} h</p>
              <p>{this.props.getObject('meetingAccommodation').duration} h</p>
            </Grid.Column>
            <Grid.Column width={4}>
              <p>{this.props.getObject('dayMeeting').price} € + alv</p>
              <p>{this.props.getObject('dayMeetingSauna').price} € + alv</p>
              <p>{this.props.getObject('lunchToLunchAccommodation').price} € + alv</p>
              <p>{this.props.getObject('meetingAccommodation').price} € + alv</p>
            </Grid.Column>
          </Grid>
        </React.Fragment>}
        { values.visitType === 'recreational' &&
        <React.Fragment>
          <Header as="h4" dividing>Millaisen virkistyspäivän haluat pitää?</Header>
          <Form.Field inline>
            <Checkbox radio label={this.props.getObject('luonnonLumoa').value} value="luonnonLumoa" checked={values.recreationalType === 'luonnonLumoa'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'recreationalType')} />
            <Icon link name="info circle" content={this.props.getObject('luonnonLumoa').url} />
          </Form.Field>
          <Form.Field inline>
            <Checkbox radio label={this.props.getObject('liikkumisenIloa').value} value="liikkumisenIloa" checked={values.recreationalType === 'liikkumisenIloa'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'recreationalType')} />
            <Icon link name="info circle" content={this.props.getObject('liikkumisenIloa').url} />

          </Form.Field>
        </React.Fragment>}

        { values.visitType &&
          <React.Fragment>
            <Header as="h4" dividing>Mitä tiloja haluat käyttää?</Header>
            <Form.Radio label={this.props.getObject('villaParatiisi').value} value="villaParatiisi" checked={values.locationType === 'villaParatiisi'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'locationType')} />
            <Form.Radio label={this.props.getObject('salmenTupa').value} value="salmenTupa" checked={values.locationType === 'salmenTupa'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'locationType')} />
            { values.visitType !== 'meeting' &&
            <React.Fragment>
              <Form.Radio label={this.props.getObject('nuuksionTupa').value} value="nuuksionTupa" checked={values.locationType === 'nuuksionTupa'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'locationType')} />
              <Form.Radio label={this.props.getObject('luontoIlmanTiloja').value} value="luontoIlmanTiloja" checked={values.locationType === 'luontoIlmanTiloja'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'locationType')} />
            </React.Fragment>
            }
          </React.Fragment>
        }
      </React.Fragment>
    );
  }
}
export default CompanyForm;

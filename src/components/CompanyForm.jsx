import React from 'react';
import { Header, Form, Grid, Checkbox, Icon } from 'semantic-ui-react';
import InfoPopup from './InfoPopup';


class CompanyForm extends React.Component {
  state = { };

  render() {
    const { values } = this.props;
    return (
      <div>
        <Header as="h4" dividing>Mikä on vierailusi tyyppi?</Header>
        <Form.Radio label={this.props.getObject('meeting').value} value="meeting" checked={values.visitType === 'meeting'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'visitType')} />
        <Form.Radio label={this.props.getObject('recreational').value} value="recreational" checked={values.visitType === 'recreational'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'visitType')} />
        <Form.Group inline>
          <Form.Radio label={this.props.getObject('somethingElse').value} value="somethingElse" checked={values.visitType === 'somethingElse'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'visitType')} />
          <Form.Input width={8} />
        </Form.Group>
        { values.visitType === 'meeting' &&
        <div>
          <Header as="h4" dividing>Millaisen kokouksen haluat pitää?</Header>
          <Grid style={{ marginBottom: '1px' }}>
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
        </div>}
      </div>
    );
  }
}
export default CompanyForm;

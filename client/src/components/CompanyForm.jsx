import React from 'react';
import { Header, Form, Grid, Checkbox } from 'semantic-ui-react';
import InfoPopup from './InfoPopup';

class CompanyForm extends React.Component {
  state = {};

  renderVisitOptions = (title, key, type) => {
    return (
      <React.Fragment>
        <Header as="h4">{title}</Header>
        <Grid>
          {this.props.getObject(key).options.map(m => (
            <Grid.Row key={m.key}>
              <Grid.Column width={10}>
                <Form.Field inline>
                  <Checkbox
                    radio
                    label={m.fi}
                    value={m.key}
                    checked={this.props.values[type] === m.key}
                    onChange={(e, data) => this.props.handleOnRadioChange(e, data, type)}
                  />
                  {this.props.showInfo(m) && <InfoPopup icon="info circle" content={this.props.showInfo(m)} />}
                </Form.Field>
              </Grid.Column>
              <Grid.Column width={2}>
                <p>{m.duration} h</p>
              </Grid.Column>
              <Grid.Column width={4}>
                <p>{m.price} € + alv</p>
              </Grid.Column>
            </Grid.Row>
          ))}
        </Grid>
      </React.Fragment>
    );
  };

  render() {
    const { values } = this.props;
    return (
      <React.Fragment>
        <Form.Input
          width={8}
          label={this.props.getObject('companyName').fi}
          id="companyName"
          value={values.companyName}
          onChange={this.props.handleOnChange}
        />
        <Header as="h4">{this.props.getObject('visitTypeTitle').fi}</Header>
        <Form.Radio
          label={this.props.getObject('meeting').fi}
          value="meeting"
          checked={values.visitType === 'meeting'}
          onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'visitType')}
        />
        <Form.Radio
          label={this.props.getObject('recreational').fi}
          value="recreational"
          checked={values.visitType === 'recreational'}
          onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'visitType')}
        />
        <Form.Input
          width={8}
          label={this.props.getObject('visitTypeString').fi}
          id="visitTypeString"
          value={values.visitTypeString}
          onChange={this.props.handleOnChange}
        />
        {values.visitType === 'meeting' && this.renderVisitOptions('Millaisen kokouksen haluat pitää?', 'meetingOptions', 'meetingType')}
        {values.visitType === 'recreational' &&
          this.renderVisitOptions('Millaisen virkistyspäivän haluat pitää?', 'recreationOptions', 'recreationType')}

        {(values.visitType && values.visitType !== 'meeting') || !!values.visitTypeString ? (
          <React.Fragment>
            <Header as="h4">{this.props.getObject('locationTitle').fi}</Header>
            <Form.Radio
              label={`${this.props.getObject('villaParatiisi').fi} (max. 20-25 hlöä)`}
              value="villaParatiisi"
              checked={values.locationType === 'villaParatiisi'}
              onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'locationType')}
            />
            <React.Fragment>
              <Form.Radio
                label={this.props.getObject('ilmanTiloja').fi}
                value="ilmanTiloja"
                checked={values.locationType === 'ilmanTiloja'}
                onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'locationType')}
              />
              <Form.Radio
                label={this.props.getObject('haltia').fi}
                value="haltia"
                checked={values.locationType === 'haltia'}
                onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'locationType')}
              />
            </React.Fragment>
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }
}
export default CompanyForm;

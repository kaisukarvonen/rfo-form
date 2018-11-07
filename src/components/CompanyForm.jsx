import React from 'react';
import { Header, Form, Grid, Checkbox } from 'semantic-ui-react';
import InfoPopup from './InfoPopup';
import { lan } from '../utils';

class CompanyForm extends React.Component {
  state = { };


  render() {
    const { values } = this.props;
    return (
      <React.Fragment>
        <Form.Input width={8} label={this.props.getObject('companyName')[lan]} id="companyName" value={values.companyName} onChange={this.props.handleOnChange} />
        <Header as="h4">{this.props.getObject('visitTypeTitle')[lan]}</Header>
        <Form.Radio label={this.props.getObject('meeting')[lan]} value="meeting" checked={values.visitType === 'meeting'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'visitType')} />
        <Form.Radio label={this.props.getObject('recreational')[lan]} value="recreational" checked={values.visitType === 'recreational'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'visitType')} />
        <Form.Input width={8} label={this.props.getObject('visitTypeString')[lan]} id="visitTypeString" value={values.visitTypeString} onChange={this.props.handleOnChange} />
        { values.visitType === 'meeting' &&
        <React.Fragment>
          <Header as="h4">{this.props.getObject('meetingTitle')[lan]}</Header>
          <Grid>
            { this.props.getObject('meetingOptions').options.map(m =>
              (
                <Grid.Row key={m.key}>
                  <Grid.Column width={10}>
                    <Form.Field inline>
                      <Checkbox radio label={m[lan]} value={m.key} checked={values.meetingType === m.key} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'meetingType')} />
                      { this.props.showInfo(m) && <InfoPopup icon="info circle" content={this.props.showInfo(m)} />}
                    </Form.Field>
                  </Grid.Column>
                  <Grid.Column width={2}>
                    <p>{m.duration} h</p>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <p>{m.price} € + {lan === 'fi' ? 'alv' : 'vat'}</p>
                  </Grid.Column>
                </Grid.Row>
            ))
          }
          </Grid>
        </React.Fragment>
        }

        { (values.visitType || values.visitTypeString.length > 0) &&
          <React.Fragment>
            <Header as="h4">{this.props.getObject('locationTitle')[lan]}</Header>
            <Form.Radio label={`${this.props.getObject('villaParatiisi')[lan]} (max. 20-25 ${lan === 'fi' ? 'hlöä' : 'persons'})`} value="villaParatiisi" checked={values.locationType === 'villaParatiisi'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'locationType')} />
            { values.visitType !== 'meeting' &&
            <React.Fragment>
              <Form.Radio label={this.props.getObject('ilmanTiloja')[lan]} value="ilmanTiloja" checked={values.locationType === 'ilmanTiloja'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'locationType')} />
              <Form.Radio label={this.props.getObject('haltia')[lan]} value="haltia" checked={values.locationType === 'haltia'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'locationType')} />
            </React.Fragment>
            }
          </React.Fragment>
        }
      </React.Fragment>
    );
  }
}
export default CompanyForm;

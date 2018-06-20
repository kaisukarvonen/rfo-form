import React from 'react';
import { Header, Form, Grid, Checkbox, Icon } from 'semantic-ui-react';
import InfoPopup from './InfoPopup';
import lan from '../utils';

class CompanyForm extends React.Component {
  state = { };

  displayLimits = (object) => {
    let limit = '';
    if (object.max && !object.min) {
      limit = lan === 'fi' ? ` (alle ${object.max} hlöä)` : ` (max ${object.max} people)`;
    } else if (object.min && !object.max) {
      limit = lan === 'fi' ? ` (yli ${object.min} hlöä)` : ` (min ${object.min} people)`;
    } else {
      limit = lan === 'fi' ? ` (${object.min} - ${object.max} hlöä)` : ` (${object.min} - ${object.max} people)`;
    }
    return object[lan] + limit;
  }


  render() {
    const { values } = this.props;
    return (
      <React.Fragment>
        <Form.Input width={8} label={this.props.getObject('companyName')[lan]} id="companyName" value={values.companyName} onChange={this.props.handleOnChange} />
        <Header as="h4" dividing>{this.props.getObject('visitTypeTitle')[lan]}</Header>
        <Form.Radio label={this.props.getObject('meeting')[lan]} value="meeting" checked={values.visitType === 'meeting'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'visitType')} />
        <Form.Radio label={this.props.getObject('recreational')[lan]} value="recreational" checked={values.visitType === 'recreational'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'visitType')} />
        <Form.Input width={8} label={this.props.getObject('visitTypeString')[lan]} id="visitTypeString" value={values.visitTypeString} onChange={this.props.handleOnChange} />
        { values.visitType === 'meeting' &&
        <React.Fragment>
          <Header as="h4" dividing>{this.props.getObject('meetingTitle')[lan]}</Header>
          <Grid>
            { this.props.getObject('meetingOptions').options.map(m =>
              (
                <Grid.Row key={m.key}>
                  <Grid.Column width={10}>
                    <Form.Field inline>
                      <Checkbox radio label={m[lan]} value={m.key} checked={values.meetingType === m.key} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'meetingType')} />
                      { m.info && <InfoPopup icon="info circle" content={m.info} />}
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
            <Header as="h4" dividing>{this.props.getObject('locationTitle')[lan]}</Header>
            <Form.Radio label={this.displayLimits(this.props.getObject('villaParatiisi'))} value="villaParatiisi" checked={values.locationType === 'villaParatiisi'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'locationType')} />
            <Form.Radio label={this.displayLimits(this.props.getObject('pohjoinenPortti'))} value="pohjoinenPortti" checked={values.locationType === 'pohjoinenPortti'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'locationType')} />
            { values.visitType !== 'meeting' &&
            <React.Fragment>
              <Form.Radio label={this.props.getObject('ilmanTiloja')[lan]} value="ilmanTiloja" checked={values.locationType === 'ilmanTiloja'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'locationType')} />
            </React.Fragment>
            }
          </React.Fragment>
        }
      </React.Fragment>
    );
  }
}
export default CompanyForm;

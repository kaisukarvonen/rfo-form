import React from 'react';
import { Header, Form, Grid } from 'semantic-ui-react';
import { lan } from '../utils';

class PrivatePersonForm extends React.Component {
  state = { popupOpen: false };

  handleOnChange = (e, data) => {
    this.setState({ [data.id]: data.value });
  };

  toggleDatePicker = () => {
    this.setState({ popupOpen: !this.state.popupOpen });
  };

  render() {
    const { values } = this.props;
    return (
      <div>
        <Header as="h4">{this.props.getObject('visitTypeTitle')[lan]}</Header>
        <Form.Radio
          label={this.props.getObject('birthday')[lan]}
          value="birthday"
          checked={values.visitType === 'birthday'}
          onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'visitType')}
        />
        <Form.Radio
          label={this.props.getObject('bachelor')[lan]}
          value="bachelor"
          checked={values.visitType === 'bachelor'}
          onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'visitType')}
        />
        <Form.Radio
          label={this.props.getObject('party')[lan]}
          value="party"
          checked={values.visitType === 'party'}
          onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'visitType')}
        />
        <Form.Input
          width={8}
          label={this.props.getObject('visitTypeString')[lan]}
          id="visitTypeString"
          value={values.visitTypeString}
          onChange={this.props.handleOnChange}
        />

        <Header as="h4">{this.props.getObject('extraPersons')[lan]}</Header>
        <Grid>
          {this.props.getObject('extraPersons').options.map(i => (
            <Grid.Row>
              <Grid.Column width={7}>
                {i.key === 'cottage' ? (
                  <React.Fragment>
                    <p>{i[lan]}</p>
                    <Form.Group>
                      {i.choices.map((choice, index) => (
                        <Form.Checkbox
                          label={`${choice} ${lan === 'fi' ? 'hlön huone' : 'person room'}`}
                          id={index + 1}
                          checked={values.cottages[index]}
                          onChange={this.props.handleCottageChange}
                        />
                      ))}
                    </Form.Group>
                  </React.Fragment>
                ) : (
                  <Form.Checkbox label={i[lan]} id={i.key} checked={values[i.key]} onChange={this.props.handleOnChange} />
                )}
              </Grid.Column>
              <Grid.Column width={3}>
                <p>{i.price} €</p>
              </Grid.Column>
            </Grid.Row>
          ))}
        </Grid>
      </div>
    );
  }
}
export default PrivatePersonForm;

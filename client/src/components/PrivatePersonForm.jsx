import React from 'react';
import { Header, Form, Grid, Accordion, Icon } from 'semantic-ui-react';

class PrivatePersonForm extends React.Component {
  state = { popupOpen: false, showExtraPersons: false };

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
        <Header as="h4">{this.props.getObject('visitTypeTitle').fi}</Header>
        <Form.Radio
          label={this.props.getObject('birthday').fi}
          value="birthday"
          checked={values.visitType === 'birthday'}
          onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'visitType')}
        />
        <Form.Radio
          label={this.props.getObject('bachelor').fi}
          value="bachelor"
          checked={values.visitType === 'bachelor'}
          onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'visitType')}
        />
        <Form.Radio
          label={this.props.getObject('party').fi}
          value="party"
          checked={values.visitType === 'party'}
          onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'visitType')}
        />
        <Form.Input
          width={8}
          label={this.props.getObject('visitTypeString').fi}
          id="visitTypeString"
          value={values.visitTypeString}
          onChange={this.props.handleOnChange}
        />

        <Accordion>
          <Accordion.Title active={this.state.showExtraPersons} onClick={() => this.setState({ showExtraPersons: !this.state.showExtraPersons })}>
            <Header as="h4">
              <Icon name="dropdown" />
              Lisähenkilöt
            </Header>
          </Accordion.Title>
          <Accordion.Content active={this.state.showExtraPersons}>
            <Grid>
              {this.props.getObject('extraPersons').options.map(i => (
                <Grid.Row key={i.key}>
                  <Grid.Column width={14} style={{ maxWidth: '390px' }}>
                    {i.key === 'cottage' ? (
                      <React.Fragment>
                        <p>{i.fi}</p>
                        <Form.Group>
                          {i.choices.map((choice, index) => (
                            <Form.Checkbox
                              label={`${choice} hlön huone`}
                              id={index + 1}
                              checked={values.cottages[index]}
                              onChange={this.props.handleCottageChange}
                            />
                          ))}
                        </Form.Group>
                      </React.Fragment>
                    ) : (
                      <Form.Checkbox label={i.fi} id={i.key} checked={values[i.key]} onChange={this.props.handleOnChange} />
                    )}
                  </Grid.Column>
                  <Grid.Column width={2}>
                    <p>{i.price} €</p>
                  </Grid.Column>
                </Grid.Row>
              ))}
            </Grid>
          </Accordion.Content>
        </Accordion>
      </div>
    );
  }
}
export default PrivatePersonForm;

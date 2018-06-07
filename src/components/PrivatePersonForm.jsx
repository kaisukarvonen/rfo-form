import React from 'react';
import { Header, Form } from 'semantic-ui-react';


class PrivatePersonForm extends React.Component {
  state = { popupOpen: false };


  handleOnChange = (e, data) => {
    this.setState({ [data.id]: data.value });
  }

  toggleDatePicker = () => {
    this.setState({ popupOpen: !this.state.popupOpen });
  }

  render() {
    const { values } = this.props;
    return (
      <div>
        <Header as="h4" dividing>Mikä on vierailusi tyyppi?</Header>
        <Form.Radio label="Synttärit" value="birthday" checked={values.visitType === 'birthday'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'visitType')} />
        <Form.Radio label="Polttarit" value="bachelor" checked={values.visitType === 'bachelor'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'visitType')} />
        <Form.Input width={8} label="Muu, mikä?" id="visitType" onChange={this.props.handleOnChange} />
      </div>
    );
  }
}
export default PrivatePersonForm;

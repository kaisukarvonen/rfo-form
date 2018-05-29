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
    return [
      <Header as="h4" dividing>Mikä on vierailusi tyyppi?</Header>,
      <Form.Radio label="Synttärit" />,
      <Form.Radio label="Polttarit" />,
      <Form.Group inline>
        <Form.Radio label="Muu, mikä?" />
        <Form.Input width={8} />
      </Form.Group>,
    ];
  }
}
export default PrivatePersonForm;

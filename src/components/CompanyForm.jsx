import React from 'react';
import { Container, Header, Form } from 'semantic-ui-react';
// import '../css/styles.css';


class CompanyForm extends React.Component {
  state = { };


  handleOnChange = (e, data) => {
    this.setState({ [data.id]: data.value });
  }

  render() {
    console.log(this.props);
    return [
      <Header as="h4" dividing>Mikä on vierailusi tyyppi?</Header>,
      <Form.Radio label={this.props.getValue('meeting')} />,
      <Form.Radio label={this.props.getValue('recreational')} />,
      <Form.Group inline>
        <Form.Radio label={this.props.getValue('somethingElse')} />
        <Form.Input width={8} />
      </Form.Group>,
    ];
  }
}
export default CompanyForm;

import React from 'react';
import { Container, Header, Form } from 'semantic-ui-react';
// import '../css/styles.css';


class CompanyForm extends React.Component {
  state = { };


  handleOnChange = (e, data) => {
    this.setState({ [data.id]: data.value });
  }

  render() {
    return [
      'plaa',
    ];
  }
}
export default CompanyForm;

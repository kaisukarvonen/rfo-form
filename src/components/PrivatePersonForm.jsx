import React from 'react';
import { Header, Form } from 'semantic-ui-react';
import { lan } from '../utils';

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
        <Header as="h4" dividing>{this.props.getObject('visitTypeTitle')[lan]}</Header>
        <Form.Radio label={this.props.getObject('birthday')[lan]} value="birthday" checked={values.visitType === 'birthday'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'visitType')} />
        <Form.Radio label={this.props.getObject('bachelor')[lan]} value="bachelor" checked={values.visitType === 'bachelor'} onChange={(e, data) => this.props.handleOnRadioChange(e, data, 'visitType')} />
        <Form.Input width={8} label={this.props.getObject('visitTypeString')[lan]} id="visitTypeString" value={values.visitTypeString} onChange={this.props.handleOnChange} />
      </div>
    );
  }
}
export default PrivatePersonForm;

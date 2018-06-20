import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as fieldActions from '../dux/fields';
import * as mailActions from '../dux/mail';
import '../css/styles.css';
import '../css/DayPicker.css';
import ErrorBoundary from './ErrorBoundary';
import Form from './Form';


class App extends React.Component {
  state = {};

  componentDidMount = () => {
    this.props.fetchFields();
  }


  render() {
    return (
      <ErrorBoundary>
        { this.props.fields.length > 0 &&
        <Form
          fields={this.props.fields}
          sendMail={this.props.sendMail}
        />
        }
      </ErrorBoundary>
    );
  }
}

export default connect(
  state => ({
    fields: state.fields,
  }),
  dispatch => (bindActionCreators({
    ...fieldActions,
    ...mailActions,
  }, dispatch)),
)(App);

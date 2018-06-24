import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as fieldActions from '../dux/fields';
import * as mailActions from '../dux/mail';
import '../css/styles.css';
import '../css/DayPicker.css';
import ErrorBoundary from './ErrorBoundary';
import Notification from './Notification';
import Form from './Form';

const propTypes = {
  notification: PropTypes.bool,
};

const defaultProps = {
  notification: {},
};

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
        { !_.isEmpty(this.props.notification) &&
        <Notification notification={this.props.notification} />
      }
      </ErrorBoundary>
    );
  }
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;
export default connect(
  state => ({
    fields: state.fields.fields,
    notification: state.notification.notification,
  }),
  dispatch => (bindActionCreators({
    ...fieldActions,
    ...mailActions,
  }, dispatch)),
)(App);

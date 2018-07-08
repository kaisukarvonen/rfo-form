import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Loader, Dimmer } from 'semantic-ui-react';
import _ from 'lodash';
import * as fieldActions from '../dux/fields';
import * as mailActions from '../dux/mail';
import * as notificationActions from '../dux/notification';
import '../css/styles.css';
import '../css/DayPicker.css';
import { lan } from '../utils';

import ErrorBoundary from './ErrorBoundary';
import Notification from './Notification';
import Form from './Form';

const propTypes = {
  notification: PropTypes.bool,
  fetchFields: PropTypes.func.isRequired,
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
        <div>
          <Dimmer active={this.props.sendingEmail} inverted>
            <Loader inverted>{lan === 'fi' ? 'Viestiäsi lähetetään ...' : 'Your message is being sent ...'}</Loader>
          </Dimmer>
          <Form
            fields={this.props.fields}
            sendMail={this.props.sendMail}
          />
        </div>
        }
        { !_.isEmpty(this.props.notification) &&
        <Notification
          notification={this.props.notification}
          hideNotification={this.props.hideNotification}
        />
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
    sendingEmail: state.mail.sendingEmail,
  }),
  dispatch => (bindActionCreators({
    ...fieldActions,
    ...mailActions,
    ...notificationActions,
  }, dispatch)),
)(App);

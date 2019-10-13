import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Loader, Dimmer } from 'semantic-ui-react';
import * as fieldActions from '../dux/fields';
import * as mailActions from '../dux/mail';
import * as notificationActions from '../dux/notification';
import '../css/styles.css';
import '../css/DayPicker.css';
import ErrorBoundary from './ErrorBoundary';
import Notification from './Notification';
import Form from './Form';
import DatePicker from './DatePicker';

const App = ({ hideNotification, notification, fetchFields, fields, sendingEmail, sendMail }) => {
  useEffect(() => {
    fetchFields();
  }, []);

  const showCalendarOnly = () => window.location.href.includes('calendar');

  return (
    <ErrorBoundary>
      {!!fields.length && (
        <div>
          <Dimmer active={sendingEmail} inverted>
            <Loader inverted>Viestiäsi lähetetään ...</Loader>
          </Dimmer>
          {showCalendarOnly() ? <DatePicker compact calendarOnly /> : <Form fields={fields} sendMail={sendMail} />}
        </div>
      )}
      {!!Object.getOwnPropertyNames(notification).length && (
        <Notification notification={notification} hideNotification={hideNotification} />
      )}
    </ErrorBoundary>
  );
};

export default connect(
  state => ({
    fields: state.fields.fields,
    notification: state.notification.notification,
    sendingEmail: state.mail.sendingEmail
  }),
  dispatch =>
    bindActionCreators(
      {
        ...fieldActions,
        ...mailActions,
        ...notificationActions
      },
      dispatch
    )
)(App);

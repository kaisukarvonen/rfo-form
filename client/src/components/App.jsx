import React, { useEffect, useState } from 'react';
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
import { getCalendarEvents, formatDates } from '../utils';

const App = ({ hideNotification, notification, fetchFields, fields, sendingEmail, sendMail }) => {
  const [disabled, setDisabledDays] = useState([]);
  const [availableFrom16, setAvailableFrom16] = useState([]);
  const [availableUntil12, setAvailableUntil12] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchFields();
    getCalendarEvents().then((response) => {
      const { disabledDays, from16, until12 } = formatDates(response.data.items);
      setDisabledDays(disabledDays);
      setAvailableFrom16(from16);
      setAvailableUntil12(until12);
      setLoading(false);
    });
  }, []);

  const showCalendarOnly = () => window.location.href.includes('calendar');

  return (
    <ErrorBoundary>
      {!!fields.length && (
        <div>
          <Dimmer active={sendingEmail} inverted>
            <Loader inverted>Viestiäsi lähetetään ...</Loader>
          </Dimmer>
          {showCalendarOnly() ? (
            <DatePicker
              disabledDays={disabled}
              availableFrom16={availableFrom16}
              availableUntil12={availableUntil12}
              loading={loading}
              compact
              calendarOnly
            />
          ) : (
            <Form
              fields={fields}
              disabledDays={disabled}
              availableFrom16={availableFrom16}
              availableUntil12={availableUntil12}
              sendMail={sendMail}
            />
          )}
        </div>
      )}
      {!!Object.getOwnPropertyNames(notification).length && (
        <Notification notification={notification} hideNotification={hideNotification} />
      )}
    </ErrorBoundary>
  );
};

export default connect(
  (state) => ({
    fields: state.fields.fields,
    notification: state.notification.notification,
    sendingEmail: state.mail.sendingEmail,
  }),
  (dispatch) =>
    bindActionCreators(
      {
        ...fieldActions,
        ...mailActions,
        ...notificationActions,
      },
      dispatch
    )
)(App);

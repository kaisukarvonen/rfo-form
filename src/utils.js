import axios from 'axios';
import moment from 'moment';
import { GOOGLE_API_KEY, CALENDAR_ID } from './config';

export const lan = new URLSearchParams(window.location.search).get('language') || 'fi';

export const getCalendarEvents = () => {
  const minDate = moment().startOf('day').toISOString();
  // const minDate = moment().add(1, 'months').toISOString();
  const maxDate = moment().startOf('day').add(5, 'months').toISOString();
  const promise =
    axios.get(`https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events`, {
      params: {
        key: GOOGLE_API_KEY,
        timeMin: minDate,
        timeMax: maxDate,
        orderBy: 'startTime',
        singleEvents: true,
      },
    })
      .then(response => response)
      .catch(error => error);
  return promise;
};

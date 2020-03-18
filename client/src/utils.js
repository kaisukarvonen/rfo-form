import axios from 'axios';
import React from 'react';
import moment from 'moment';
import { GOOGLE_API_KEY, CALENDAR_ID } from './config';

export const lan = new URLSearchParams(window.location.search).get('language') || 'fi';

export const getCalendarEvents = () => {
  const minDate = moment()
    .startOf('day')
    .toISOString();
  // const minDate = moment().add(1, 'months').toISOString();
  const maxDate = moment()
    .startOf('day')
    .add(14, 'months')
    .toISOString();
  const promise = axios
    .get(`https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events`, {
      params: {
        key: GOOGLE_API_KEY,
        timeMin: minDate,
        timeMax: maxDate,
        orderBy: 'startTime',
        singleEvents: true
      }
    })
    .then(response => response)
    .catch(error => error);
  return promise;
};

export const formatDates = events => {
  // if end is before 12 --> availableFrom16
  // if start is after 16 --> availableUntil12
  const disabledDays = [];
  const from16 = [];
  const until12 = [];
  events.forEach(event => {
    // each event has end and start object with either date or dateTime
    if (event.start.date) {
      // event has only date and no time defined --> it lasts whole day
      const end = moment(event.end.date);
      const date = moment(event.start.date);
      while (date.format() !== end.format()) {
        disabledDays.push(date.toDate());
        date.add(1, 'days');
      }
    } else {
      // event starts and ends at certain time
      const start = moment(event.start.dateTime);
      const date = moment(event.start.dateTime);
      const end = moment(event.end.dateTime);
      while (date.format('YYYY-MM-DD') !== end.format('YYYY-MM-DD')) {
        // between dates are disabled but not first & last day
        date.add(1, 'days');
        disabledDays.push(date.toDate());
      }
      // event started before 16 oclock --> date is full
      const fStart = new Date(start.format('YYYY-MM-DD'));
      if (fStart >= moment()) {
        if (start.hour() < 15) {
          disabledDays.push(fStart);
        } else if (from16.includes(fStart)) {
          disabledDays.push(fStart);
          const index = from16.findIndex(d => d === fStart);
          from16.splice(index, 1);
        } else {
          until12.push(fStart);
        }
      }
      const fEnd = new Date(end.format('YYYY-MM-DD'));
      if (end.hour() > 11) {
        disabledDays.push(fEnd);
      } else if (until12.includes(fEnd)) {
        disabledDays.push(fEnd);
        const index = until12.findIndex(d => d === fEnd);
        until12.splice(index, 1);
      } else {
        from16.push(fEnd);
      }
    }
  });
  return { disabledDays, from16, until12 };
};

export const validEmail = email =>
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
    email
  ); // credit: MDN

export const showInfo = object => {
  let info = object.infoFi;
  if (info && info.includes('*s_link*')) {
    const link = '*s_link*';
    const address = info.substring(info.indexOf(link) + link.length, info.indexOf('*e_link*'));
    const linkName = info.substring(info.indexOf('*s_text*') + link.length, info.indexOf('*e_text*'));
    info = (
      <span>
        {info.substring(0, info.indexOf(link))}
        <a href={address.includes('http') ? address : `http://${address}`} target="blank">
          {linkName}
        </a>
        {info.substring(info.indexOf('*e_text*') + link.length)}
      </span>
    );
  }
  return info;
};

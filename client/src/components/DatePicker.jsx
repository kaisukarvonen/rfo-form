import React, { useState, useEffect } from 'react';
import MomentLocaleUtils from 'react-day-picker/moment';
import DayPicker from 'react-day-picker';
import { Label } from 'semantic-ui-react';
import 'moment/locale/fi';
import { getCalendarEvents, formatDates } from '../utils';

const DatePicker = ({ handleDayClick, from, to, until12Info, from16Info, compact, className, calendarOnly }) => {
  const [disabledDays, setDisabledDays] = useState([]);
  const [availableFrom16, setAvailableFrom16] = useState([]);
  const [availableUntil12, setAvailableUntil12] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCalendarEvents().then(response => {
      const { disabledDays, from16, until12 } = formatDates(response.data.items);
      setDisabledDays(disabledDays);
      setAvailableFrom16(from16);
      setAvailableUntil12(until12);
      setLoading(false);
    });
  }, []);

  const modifiers = {
    start: from,
    end: to,
    availableUntil12: availableUntil12,
    availableFrom16: availableFrom16
  };

  return (
    <div className={className || ''} style={{ opacity: loading ? 0 : 1 }}>
      <DayPicker
        localeUtils={MomentLocaleUtils}
        locale={'fi'}
        months={
          calendarOnly && [
            'tammi / january',
            'helmi / february',
            'maalis / march',
            'huhti / april',
            'touko / may',
            'kesä / june',
            'heinä / july',
            'elo / august',
            'syys / september',
            'loka / october',
            'marras / november',
            'joulu / december'
          ]
        }
        numberOfMonths={compact ? 1 : 2}
        fromMonth={new Date()}
        className="Selectable"
        onDayClick={handleDayClick}
        modifiers={modifiers}
        selectedDays={[from, { from, to }]}
        disabledDays={[{ before: new Date() }, ...disabledDays]}
      />
      <div style={{ margin: '0 0 0 20px' }}>
        {until12Info && <p>Vapaa klo 12 asti {calendarOnly && `/ Available until 12 o'clock`}</p>}
        {from16Info && <p>Vapaa klo 16 alkaen {calendarOnly && `/ Available from 16 o'clock`}</p>}
        <Label
          style={{
            backgroundColor: '#c2e2b3',
            margin: '0 8px 0 0'
          }}
          size="large"
          circular
          empty
        />
        Vapaa {calendarOnly && `/ Available`}
        <div style={{ display: compact ? 'block' : 'inline-block' }}>
          <Label
            style={{
              backgroundColor: '#ffc107',
              margin: compact ? '0 8px 0 0' : '0 8px'
            }}
            size="large"
            circular
            empty
          />
          Osittain vapaa {calendarOnly && `/ Partly available`}
        </div>
      </div>
    </div>
  );
};

export default DatePicker;

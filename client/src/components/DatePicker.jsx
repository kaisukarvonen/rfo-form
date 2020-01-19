import React from 'react';
import MomentLocaleUtils from 'react-day-picker/moment';
import DayPicker from 'react-day-picker';
import { Label } from 'semantic-ui-react';
import 'moment/locale/fi';

const DatePicker = ({
  handleDayClick,
  from,
  disabledDays,
  availableFrom16,
  availableUntil12,
  to,
  until12Info,
  from16Info,
  compact,
  className,
  calendarOnly,
  loading
}) => {
  const modifiers = {
    start: from,
    end: to,
    availableUntil12,
    availableFrom16
  };

  return (
    <div className={className || ''} style={{ opacity: loading ? 0 : 1 }}>
      <DayPicker
        localeUtils={MomentLocaleUtils}
        locale="fi"
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

import React from 'react';
import MomentLocaleUtils from 'react-day-picker/moment';
import DayPicker from 'react-day-picker';
import { Label, Button } from 'semantic-ui-react';
import 'moment/locale/fi';

const DatePicker = ({
  handleDayClick,
  from,
  disabledDays,
  availableFrom16,
  availableUntil12,
  to,
  compact,
  className,
  calendarOnly,
  loading,
  alwaysAvailable,
}) => {
  const modifiers = {
    start: from,
    end: to,
  };
  const pastDays = { before: new Date() };

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
            'joulu / december',
          ]
        }
        numberOfMonths={compact ? 1 : 2}
        fromMonth={new Date()}
        className={`Selectable ${calendarOnly ? 'calendar-only' : ''}`}
        onDayClick={handleDayClick}
        modifiers={!alwaysAvailable ? { ...modifiers, availableFrom16, availableUntil12 } : modifiers}
        selectedDays={[from, { from, to }]}
        disabledDays={alwaysAvailable ? [pastDays] : [pastDays, ...disabledDays]}
      />
      {!alwaysAvailable && (
        <div style={{ margin: '0 0 0 20px' }}>
          <Label
            style={{
              backgroundColor: '#c2e2b3',
              margin: '0 8px 0 0',
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
                margin: compact ? '0 8px 0 0' : '0 8px',
              }}
              size="large"
              circular
              empty
            />
            Osittain vapaa {calendarOnly && `/ Partly available`}
          </div>
        </div>
      )}
      {calendarOnly && (
        <>
          <Button
            style={{ margin: 20 }}
            compact
            size="small"
            basic
            onClick={() => (window.parent.location.href = 'https://www.nuuksiontaika.fi/tarjouspyynto/')}
          >
            Pyydä tarjous
          </Button>
        </>
      )}
    </div>
  );
};

export default DatePicker;

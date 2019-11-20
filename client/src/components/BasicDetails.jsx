import React from 'react';
import { Form as SemanticForm, Popup, Message, Header } from 'semantic-ui-react';
import 'moment/locale/fi';
import DatePicker from './DatePicker';

const BasicDetails = ({ formData, dateToStr, getObject, handleOnChange, handleDayClick, popupOpen, toggleDatePicker }) => {
  const timeOptions = () => {
    const options = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'].map(time => ({
      key: time,
      value: time,
      text: `${time}:00`
    }));
    return options;
  };

  const { from, to } = formData;
  const dateValue = dateToStr(from, to);
  return (
    <React.Fragment>
      <Header as="h4" dividing style={{ marginTop: 16 }}>
        Täytä yhteystiedot ja vierailusi ajankohta
      </Header>
      <SemanticForm.Group widths="equal">
        <SemanticForm.Input required label={getObject('name').fi} id="name" onChange={handleOnChange} />
        <SemanticForm.Input required label={getObject('email').fi} id="email" onChange={handleOnChange} />
      </SemanticForm.Group>
      <SemanticForm.Group widths="equal">
        <SemanticForm.Input label={getObject('phone').fi} id="phone" onChange={handleOnChange} />
        <SemanticForm.Input label={getObject('address').fi} id="address" onChange={handleOnChange} />
      </SemanticForm.Group>

      <SemanticForm.Group>
        <Popup
          flowing
          on="click"
          position="left center"
          open={popupOpen}
          onClose={toggleDatePicker}
          onOpen={toggleDatePicker}
          trigger={
            <SemanticForm.Input
              required
              width={5}
              label={getObject('dates').fi}
              icon="calendar outline"
              id="dates"
              value={dateValue}
            />
          }
          content={
            <React.Fragment>
              <DatePicker
                className="hide-mobile"
                from={from}
                to={to}
                handleDayClick={handleDayClick}
                until12Info={formData.until12Info}
                from16Info={formData.from16Info}
              />
              <DatePicker
                className="hide-fullscreen"
                compact
                from={from}
                to={to}
                handleDayClick={handleDayClick}
                until12Info={formData.until12Info}
                from16Info={formData.from16Info}
              />
            </React.Fragment>
          }
        />
        <SemanticForm.Select
          label={getObject('arrivalTime').fi}
          width={4}
          compact
          required
          style={{
            pointerEvents: formData.type === 'company' ? 'auto' : 'none'
          }}
          placeholder="hh:mm"
          options={timeOptions()}
          value={formData.arrivalTime}
          id="arrivalTime"
          onChange={handleOnChange}
        />
        <SemanticForm.Select
          label={getObject('departTime').fi}
          width={4}
          compact
          required
          style={{
            pointerEvents: formData.type === 'company' ? 'auto' : 'none'
          }}
          placeholder="hh:mm"
          options={timeOptions()}
          value={formData.departTime}
          id="departTime"
          onChange={handleOnChange}
        />
        <SemanticForm.Input
          type="number"
          label={getObject('personAmount').fi}
          width={3}
          min="1"
          required
          id="personAmount"
          value={formData.personAmount}
          onChange={handleOnChange}
        />
      </SemanticForm.Group>

      {formData.type === 'private' && (
        <React.Fragment>
          <Message>
            <Message.Content>{getObject('acommodationInfo').summer.fi}</Message.Content>
          </Message>
          <Message>
            <Message.Content>{getObject('acommodationInfo').winter.fi}</Message.Content>
          </Message>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default BasicDetails;

import React from 'react';
import { Form as SemanticForm, Popup, Message, Header, Divider } from 'semantic-ui-react';
import 'moment/locale/fi';
import DatePicker from './DatePicker';

const BasicDetails = ({
  formData,
  dateToStr,
  getObject,
  handleOnChange,
  handleDayClick,
  popupOpen,
  toggleDatePicker,
  getObjectInList
}) => {
  const timeOptions = () => {
    const options = new Array(17).fill(null).map((val, i) => {
      const time = 8 + i;
      return {
        key: time,
        value: time,
        text: `${time}:00`
      };
    });
    return options;
  };

  const padded = {
    marginBottom: 8
  };

  const { from, to } = formData;
  const dateValue = dateToStr(from, to);
  return (
    <React.Fragment>
      <Header as="h3" dividing style={{ marginTop: 16 }}>
        Täytä yhteystiedot ja vierailusi ajankohta
      </Header>
      <SemanticForm.Group widths="equal">
        <SemanticForm.Input required label={getObject('name').fi} id="name" onChange={handleOnChange} />
        <SemanticForm.Input required label={getObject('email').fi} id="email" onChange={handleOnChange} />
      </SemanticForm.Group>
      <SemanticForm.Group widths="equal">
        <SemanticForm.Input label={getObject('phone').fi} id="phone" type="telsett" onChange={handleOnChange} />
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
        <Message>
          <Message.Header>Kesäkausi (touko-lokakuu)</Message.Header>
          <Message.Content style={padded}>
            5 huonetta /12 hlöä /vrk {getObject('acommodationPrices').summer['1']} €, lisäksi 2 hlön huone mökissä{' '}
            {getObjectInList('extraPersons', 'cottage').summer['1']} €/vrk
            <br />
            Lisäpäivät {getObject('acommodationPrices').summer['2']} €, lisähuone{' '}
            {getObjectInList('extraPersons', 'cottage').summer['2']} €/vrk
          </Message.Content>
          <Message.Header>Talvikausi (marras-huhtikuu)</Message.Header>
          <Message.Content style={padded}>
            2 huonetta /6 hlöä /vrk {getObject('acommodationPrices').winter['1']} €, lisäksi mökeissä 4 huonetta{' '}
            {getObjectInList('extraPersons', 'cottage').winter['1']} €/huone
            <br />
            Lisäpäivät {getObject('acommodationPrices').winter['2']} €, lisähuone{' '}
            {getObjectInList('extraPersons', 'cottage').winter['2']} €/vrk
          </Message.Content>
          Joulu ja Uusivuosi kesähinnoittelun mukaan. Hinta sisältää klo 16-12 välisen oleskelun.
        </Message>
      )}
    </React.Fragment>
  );
};

export default BasicDetails;
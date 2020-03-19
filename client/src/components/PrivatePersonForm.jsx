import React from 'react';
import { Header, Form, Button } from 'semantic-ui-react';
import Wainola from './Wainola';

const PrivatePersonForm = ({ values, getObject, handleOnChange, handleOnRadioChange }) => {
  return (
    <div>
      <Header as="h4">{getObject('visitTypeTitle').fi}</Header>
      <Form.Radio
        label={getObject('birthday').fi}
        value="birthday"
        checked={values.visitType === 'birthday'}
        onChange={(e, data) => handleOnRadioChange(e, data, 'visitType')}
      />
      <Form.Radio
        label={getObject('bachelor').fi}
        value="bachelor"
        checked={values.visitType === 'bachelor'}
        onChange={(e, data) => handleOnRadioChange(e, data, 'visitType')}
      />
      <Form.Radio
        label={getObject('party').fi}
        value="party"
        checked={values.visitType === 'party'}
        onChange={(e, data) => handleOnRadioChange(e, data, 'visitType')}
      />
      <Form.Input
        width={8}
        label={getObject('visitTypeString').fi}
        id="visitTypeString"
        value={values.visitTypeString}
        onChange={handleOnChange}
      />

      <Header as="h3">Millaisen päivän haluat viettää?</Header>
      <div className="flex-column" style={{ marginBottom: 15 }}>
        <Button
          active={values.locationType === 'villaParatiisi'}
          compact
          size="small"
          basic
          onClick={() => handleOnChange(null, { id: 'locationType', value: 'villaParatiisi' })}
        >
          <b>{getObject('villaParatiisi').fi}</b> - rantahuvila
        </Button>
        <Wainola
          getObject={getObject}
          handleOnChange={handleOnChange}
          handleOnRadioChange={handleOnRadioChange}
          values={values}
        />
      </div>
    </div>
  );
};
export default PrivatePersonForm;

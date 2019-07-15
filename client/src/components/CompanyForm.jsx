import React from 'react';
import { Header, Form, Grid, Checkbox } from 'semantic-ui-react';
import InfoPopup from './InfoPopup';

const CompanyForm = ({ getObject, values, showInfo, handleOnRadioChange, handleOnChange }) => {
  const visitOptions = (title, key, type) => {
    return (
      <React.Fragment>
        <Header as="h4">{title}</Header>
        <Grid>
          {getObject(key).options.map(m => (
            <Grid.Row key={m.key}>
              <Grid.Column width={10}>
                <Form.Field inline>
                  <Checkbox
                    radio
                    label={m.fi}
                    value={m.key}
                    checked={values[type] === m.key}
                    onChange={(e, data) => handleOnRadioChange(e, data, type)}
                  />
                  {showInfo(m) && <InfoPopup icon="info circle" content={showInfo(m)} />}
                </Form.Field>
              </Grid.Column>
              <Grid.Column width={2}>
                <p>{m.duration} h</p>
              </Grid.Column>
              <Grid.Column width={4}>
                <p>{m.price} € + alv</p>
              </Grid.Column>
            </Grid.Row>
          ))}
        </Grid>
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <Form.Input
        width={8}
        label={getObject('companyName').fi}
        id="companyName"
        value={values.companyName}
        onChange={handleOnChange}
      />
      <Header as="h4">{getObject('visitTypeTitle').fi}</Header>
      <Form.Radio
        label={getObject('meeting').fi}
        value="meeting"
        checked={values.visitType === 'meeting'}
        onChange={(e, data) => handleOnRadioChange(e, data, 'visitType')}
      />
      <Form.Radio
        label={getObject('recreational').fi}
        value="recreational"
        checked={values.visitType === 'recreational'}
        onChange={(e, data) => handleOnRadioChange(e, data, 'visitType')}
      />
      <Form.Input
        width={8}
        label={getObject('visitTypeString').fi}
        id="visitTypeString"
        value={values.visitTypeString}
        onChange={handleOnChange}
      />
      {values.visitType === 'meeting' && visitOptions('Millaisen kokouksen haluat pitää?', 'meetingOptions', 'meetingType')}

      {values.visitType === 'recreational' && (
        <React.Fragment>
          <Header as="h4">Missä haluat viettää päivän?</Header>
          <Form.Radio
            label={`${getObject('villaParatiisi').fi} (max. 20-25 hlöä)`}
            value="villaParatiisi"
            checked={values.locationType === 'villaParatiisi'}
            onChange={(e, data) => handleOnRadioChange(e, data, 'locationType')}
          />
          <Form.Radio
            label={getObject('ilmanTiloja').fi}
            value="ilmanTiloja"
            checked={values.locationType === 'ilmanTiloja'}
            onChange={(e, data) => handleOnRadioChange(e, data, 'locationType')}
          />
          <Form.Radio
            label={getObject('haltia').fi}
            value="haltia"
            checked={values.locationType === 'haltia'}
            onChange={(e, data) => handleOnRadioChange(e, data, 'locationType')}
          />
          {values.locationType === 'villaParatiisi' &&
            visitOptions('Millaisen virkistyspäivän haluat pitää?', 'recreationOptions', 'recreationType')}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default CompanyForm;

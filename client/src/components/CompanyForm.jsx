import React from 'react';
import { Header, Form, Grid, Checkbox } from 'semantic-ui-react';
import InfoPopup from './InfoPopup';

const CompanyForm = ({ getObject, values, showInfo, handleOnRadioChange, handleOnChange }) => {
  const visitOptions = (key, type) => {
    return (
      <React.Fragment>
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

      <React.Fragment>
        <Header as="h4">Millaisen päivän haluat viettää?</Header>
        <Form.Radio
          label={`${getObject('villaParatiisi').fi} - rantahuvila (max. 20 hlöä, majoitus 14 hlöä)`}
          value="villaParatiisi"
          checked={values.locationType === 'villaParatiisi'}
          onChange={(e, data) => handleOnRadioChange(e, data, 'locationType')}
        />
        {values.locationType === 'villaParatiisi' && visitOptions('meetingOptions', 'meetingType')}
        <Form.Radio
          label={`${getObject('wainola').fi} - ohjelmatila päiväkäyttöön (max. 50 hlöä)`}
          value="wainola"
          checked={values.locationType === 'wainola'}
          onChange={(e, data) => handleOnRadioChange(e, data, 'locationType')}
        />
        {values.locationType === 'wainola' && (
          <Grid>
            {[
              { name: 'Su-to', key: 'weekDays' },
              { name: 'Pe-la', key: 'weekend' }
            ].map(day => (
              <Grid.Row key={day.key}>
                <Grid.Column width={3} style={{ marginLeft: 10 }}>
                  {day.name}
                </Grid.Column>
                <Grid.Column width={10}>{getObject('wainola')[day.key]} € + alv</Grid.Column>
              </Grid.Row>
            ))}
          </Grid>
        )}
        <Form.Radio
          label={getObject('ilmanTiloja').fi}
          value="ilmanTiloja"
          checked={values.locationType === 'ilmanTiloja'}
          onChange={(e, data) => handleOnRadioChange(e, data, 'locationType')}
        />
        <Form.Radio
          label={`${getObject('haltia').fi} (max 200 hlöä)`}
          value="haltia"
          checked={values.locationType === 'haltia'}
          onChange={(e, data) => handleOnRadioChange(e, data, 'locationType')}
        />
      </React.Fragment>
    </React.Fragment>
  );
};

export default CompanyForm;

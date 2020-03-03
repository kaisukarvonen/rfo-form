import React from 'react';
import { Header, Form, Grid, Checkbox, Button } from 'semantic-ui-react';
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
        <Header as="h3">Millaisen päivän haluat viettää?</Header>
        <div className="flex-column">
          <Button
            active={values.locationType === 'villaParatiisi'}
            compact
            size="small"
            basic
            onClick={() => handleOnChange(null, { id: 'locationType', value: 'villaParatiisi' })}
          >
            <b>{getObject('villaParatiisi').fi}</b> - rantahuvila (max. 20 hlöä, majoitus 14 hlöä)
          </Button>
          {values.locationType === 'villaParatiisi' && visitOptions('meetingOptions', 'meetingType')}
          <Button
            active={values.locationType === 'wainola'}
            compact
            size="small"
            basic
            onClick={() => handleOnChange(null, { id: 'locationType', value: 'wainola' })}
          >
            <b>{getObject('wainola').fi}</b> - ohjelmatila päiväkäyttöön (max. 50 hlöä)
          </Button>
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
          <Button
            active={values.locationType === 'haltia'}
            compact
            size="small"
            basic
            onClick={() => handleOnChange(null, { id: 'locationType', value: 'haltia' })}
          >
            <b>{getObject('haltia').fi}</b> - (max 200 hlöä)
          </Button>
          <Button
            active={values.locationType === 'ilmanTiloja'}
            compact
            size="small"
            basic
            onClick={() => handleOnChange(null, { id: 'locationType', value: 'ilmanTiloja' })}
          >
            <b>{getObject('ilmanTiloja').fi}</b>
          </Button>
        </div>
      </React.Fragment>
    </React.Fragment>
  );
};

export default CompanyForm;

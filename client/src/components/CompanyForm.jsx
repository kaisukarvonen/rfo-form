import React from 'react';
import { Header, Form, Grid, Checkbox, Button } from 'semantic-ui-react';
import InfoPopup from './InfoPopup';
import Wainola from './Wainola';

const CompanyForm = ({ getObject, values, showInfo, handleOnRadioChange, handleOnChange }) => {
  const visitOptions = (key, type) => {
    return (
      <Grid className="extra-persons">
        {getObject(key).options.map((m) => (
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
    );
  };

  const ilmanTiloja = getObject('ilmanTiloja');

  return (
    <>
      <Form.Input
        width={8}
        label={getObject('companyName').fi}
        id="companyName"
        value={values.companyName}
        onChange={handleOnChange}
      />

      <>
        <Header as="h3">Millaisen päivän haluat viettää?</Header>
        <div className="flex-column" style={{ marginBottom: 12 }}>
          <Button
            active={values.locationType === 'villaParatiisi'}
            compact
            size="small"
            basic
            onClick={() => handleOnChange(null, { id: 'locationType', value: 'villaParatiisi' })}
          >
            <b>{getObject('villaParatiisi').fi}</b> - rantahuvila (max 20 hlöä, majoitus 14 hlöä)
          </Button>
          {values.locationType === 'villaParatiisi' && visitOptions('meetingOptions', 'meetingType')}
          <Wainola
            getObject={getObject}
            handleOnChange={handleOnChange}
            handleOnRadioChange={handleOnRadioChange}
            values={values}
            isCompany
          />
          <Button
            active={values.locationType === 'haltia'}
            compact
            size="small"
            basic
            onClick={() => handleOnChange(null, { id: 'locationType', value: 'haltia' })}
          >
            <b>{getObject('haltia').fi}</b> (max 200 hlöä)
          </Button>
          {values.locationType === 'haltia' && visitOptions('haltia', 'haltia')}
          <Button
            active={values.locationType === 'ilmanTiloja'}
            compact
            size="small"
            basic
            onClick={() => handleOnChange(null, { id: 'locationType', value: 'ilmanTiloja' })}
          >
            {getObject('ilmanTiloja').fi}
          </Button>
          {values.locationType === 'ilmanTiloja' && (
            <Grid className="extra-persons">
              <Grid.Row key={ilmanTiloja.key}>
                <Grid.Column width={10}>
                  <Form.Field inline>
                    <Checkbox
                      radio
                      label={ilmanTiloja.fi}
                      value={ilmanTiloja.key}
                      checked={values.ilmanTiloja === ilmanTiloja.key}
                      onChange={(e, data) => handleOnRadioChange(e, data, ilmanTiloja.key)}
                    />
                  </Form.Field>
                </Grid.Column>
                <Grid.Column width={5}>
                  <p>{ilmanTiloja.price} € + alv</p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          )}
        </div>
      </>
    </>
  );
};

export default CompanyForm;

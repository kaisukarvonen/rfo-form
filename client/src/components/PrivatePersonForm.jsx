import React, { useState } from 'react';
import { Header, Form, Grid, Accordion, Icon } from 'semantic-ui-react';

const PrivatePersonForm = ({ values, getObject, activePeriod, handleOnChange, handleOnRadioChange, handleCottageChange }) => {
  const [showExtraPersons, setShowExtraPersons] = useState(false);

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

      <Accordion>
        <Accordion.Title active={showExtraPersons} onClick={() => setShowExtraPersons(!showExtraPersons)}>
          <Header as="h4">
            <Icon name="dropdown" />
            Lisähenkilöt
          </Header>
        </Accordion.Title>
        <Accordion.Content active={showExtraPersons}>
          <Grid>
            {getObject('extraPersons').options.map(i => (
              <Grid.Row key={i.key}>
                <Grid.Column width={14} style={{ maxWidth: '390px' }}>
                  {i.key === 'cottage' ? (
                    <React.Fragment>
                      <p>{i.fi}</p>
                      <Form.Group>
                        {i[activePeriod].choices.map((choice, index) => (
                          <Form.Checkbox
                            label={`${choice} hlön huone`}
                            id={index + 1}
                            checked={values.cottages[index]}
                            onChange={handleCottageChange}
                          />
                        ))}
                      </Form.Group>
                    </React.Fragment>
                  ) : (
                    <Form.Checkbox label={i.fi} id={i.key} checked={values[i.key]} onChange={handleOnChange} />
                  )}
                </Grid.Column>
                <Grid.Column width={2}>
                  <p>{i.key === 'cottage' ? `${i[activePeriod]['1']} €` : `${i.price} €`}</p>
                </Grid.Column>
              </Grid.Row>
            ))}
          </Grid>
        </Accordion.Content>
      </Accordion>
    </div>
  );
};
export default PrivatePersonForm;

import React from 'react';
import { Grid, Button, Form, Checkbox } from 'semantic-ui-react';

const Wainola = ({ values, handleOnChange, getObject, isCompany, handleOnRadioChange }) => (
  <>
    <Button
      active={values.locationType === 'wainola'}
      compact
      size="small"
      basic
      onClick={() => handleOnChange(null, { id: 'locationType', value: 'wainola' })}
    >
      <b>{getObject('wainola').fi}</b> - hirsitupa päiväkäyttöön (max 50 hlöä istuen)
    </Button>
    {values.locationType === 'wainola' && (
      <Grid className="extra-persons">
        {[
          { name: 'sunnuntai-torstai', key: 'weekDays' },
          { name: 'perjantai-lauantai', key: 'weekend' }
        ].map(day => (
          <Grid.Row key={day.key}>
            <Grid.Column width={7}>
              <Form.Field inline>
                <Checkbox
                  radio
                  label={day.name}
                  value={day.key}
                  checked={values.wainola === day.key}
                  onChange={(e, data) => handleOnRadioChange(e, data, 'wainola')}
                />
              </Form.Field>
            </Grid.Column>
            <Grid.Column width={5}>
              {getObject('wainola')[day.key]} € {isCompany && '+ alv'}
            </Grid.Column>
          </Grid.Row>
        ))}
      </Grid>
    )}
  </>
);

export default Wainola;

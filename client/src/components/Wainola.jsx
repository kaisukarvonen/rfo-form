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
      <b>{getObject('wainola').fi}</b> - hirsitupa päiväkäyttöön (max 45 hlöä istuen)
    </Button>
    {values.locationType === 'wainola' && (
      <Grid className="extra-persons">
        {[
          { name: 'Sunnuntai-perjantai', key: 'weekDays' },
          { name: 'Lauantai', key: 'weekend' },
        ].map((day) => (
          <React.Fragment key={day.key}>
            <b> {day.name}</b>
            {getObject('wainola')[day.key].map((option) => (
              <Grid.Row key={option.key}>
                <Grid.Column width={6}>
                  <Form.Field inline>
                    <Checkbox
                      radio
                      label={option.text}
                      value={option.key}
                      checked={values.wainola === option.key}
                      onChange={(e, data) => handleOnRadioChange(e, data, 'wainola')}
                    />
                  </Form.Field>
                </Grid.Column>
                <Grid.Column width={3}>{option.duration} h</Grid.Column>

                {/* <Grid.Column width={4}>{isCompany ? `${option.price} € + alv` : `${option.alvPrice} €`}</Grid.Column> */}
              </Grid.Row>
            ))}
          </React.Fragment>
        ))}
      </Grid>
    )}
  </>
);

export default Wainola;

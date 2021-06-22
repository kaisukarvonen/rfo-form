import React, { Fragment, useState } from 'react';
import { Header, Form, Icon, Grid, Accordion, Checkbox } from 'semantic-ui-react';
import CustomAccordion from './CustomAccordion';

const Extras = ({ values, getObject, showInfo, handleOnChange }) => {
  const [accordions, setAccordions] = useState([]);

  const handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps;
    const indexInArray = accordions.findIndex((i) => i === index);
    const newArray = [...accordions];
    if (indexInArray !== -1) {
      newArray.splice(indexInArray, 1);
    } else {
      newArray.push(index);
    }
    setAccordions(newArray);
  };

  const displayExtraServicePrice = (object, extra) => {
    const priceField = values.type === 'company' && object.price ? 'price' : 'alvPrice';
    const alvText = priceField === 'price' ? '+ alv' : '';
    return <p style={{ paddingTop: '2px' }}>{`${object[priceField]} € ${alvText} ${extra || ''}`}</p>;
  };

  const displayCleaningPrice = (object) => {
    return `kesällä ${object.summer} €, talvella huvila ${object.winter.villa} € + ${object.winter.cottage} € / huone mökissä`;
  };

  const onActivitiesChange = (key, checked) => {
    const newArray = [...values.activities];
    if (!checked) {
      newArray.splice(newArray.indexOf(key), 1);
    } else {
      newArray.push(key);
    }
    handleOnChange(undefined, { id: 'activities', value: newArray });
  };

  return (
    <Fragment>
      <Header as="h3" dividing>
        Valitse haluamasi palvelut
      </Header>

      {values.type === 'company' && (
        <CustomAccordion
          values={values}
          accordions={accordions}
          handleOnChange={handleOnChange}
          handleAccordionClick={handleAccordionClick}
          showInfo={showInfo}
          getObject={getObject}
          title="meetingEquipment"
          index={1}
        />
      )}

      {values.locationType !== 'haltia' && (
        <CustomAccordion
          values={values}
          accordions={accordions}
          handleOnChange={handleOnChange}
          handleAccordionClick={handleAccordionClick}
          showInfo={showInfo}
          getObject={getObject}
          title="foodOptions"
          index={2}
          extraInfo="* Huomioimme kaikki erityisruokavaliot"
        />
      )}

      <Accordion>
        <Accordion.Title active={accordions.includes(3)} index={3} onClick={handleAccordionClick}>
          <Header as="h4">
            <Icon name="dropdown" />
            Ohjelmat
          </Header>
        </Accordion.Title>
        <Accordion.Content active={accordions.includes(3)}>
          <Grid stackable>
            {getObject('activities').options.map((activitySet, i) => (
              <Grid.Column key={`activities-${i}`} width={4}>
                {[activitySet.title, ...activitySet.options].map((activity, innerIndex) => (
                  <Grid.Row key={`activities-${i}-${innerIndex}`}>
                    <Form.Field inline>
                      <Checkbox
                        style={!innerIndex ? { fontWeight: 600, fontSize: '1.3rem' } : null}
                        label={activity}
                        id={`activities-${i}-${innerIndex}`}
                        checked={values.activities.includes(activity)}
                        onChange={(e, data) => onActivitiesChange(activity, data.checked)}
                      />
                    </Form.Field>
                  </Grid.Row>
                ))}
              </Grid.Column>
            ))}
          </Grid>
        </Accordion.Content>
      </Accordion>

      {(!values.locationType || values.locationType === 'villaParatiisi') && (
        <Fragment>
          <Accordion>
            <Accordion.Title active={accordions.includes(4)} index={4} onClick={handleAccordionClick}>
              <Header as="h4">
                <Icon name="dropdown" />
                {getObject('rentalEquipment').fi}
              </Header>
            </Accordion.Title>
            <Accordion.Content active={accordions.includes(4)}>
              <Grid style={{ marginBottom: '1px' }}>
                {getObject('rentalEquipment').options.map((i) => (
                  <Grid.Row key={i.key}>
                    <Grid.Column width={9} style={{ maxWidth: '250px' }}>
                      <Form.Checkbox label={i.fi} id={i.key} checked={values[i.key]} onChange={handleOnChange} />
                    </Grid.Column>
                    {/* <Grid.Column width={7}>{displayExtraServicePrice(i, i.priceInfoFi)}</Grid.Column> */}
                  </Grid.Row>
                ))}
              </Grid>
            </Accordion.Content>
          </Accordion>

          <Accordion>
            <Accordion.Title active={accordions.includes(5)} index={5} onClick={handleAccordionClick}>
              <Header as="h4">
                <Icon name="dropdown" />
                {getObject('extraServices').fi}
              </Header>
            </Accordion.Title>
            <Accordion.Content active={accordions.includes(5)}>
              <Grid style={{ marginBottom: '1px' }}>
                <Grid.Column width={9} style={{ maxWidth: '270px' }}>
                  <Form.Checkbox label={getObject('linen').fi} id="linen" checked={values.linen} onChange={handleOnChange} />
                  <Form.Checkbox label={getObject('towels').fi} id="towels" checked={values.towels} onChange={handleOnChange} />
                  <Form.Checkbox label={getObject('hottub').fi} id="hottub" checked={values.hottub} onChange={handleOnChange} />
                  <Form.Checkbox label={getObject('petFee').fi} id="petFee" checked={values.petFee} onChange={handleOnChange} />
                  {values.type === 'private' && (
                    <Form.Checkbox
                      label={getObject('cleaning').fi}
                      id="cleaning"
                      checked={values.cleaning}
                      onChange={handleOnChange}
                    />
                  )}
                </Grid.Column>
                <Grid.Column width={7}>
                  {/* {displayExtraServicePrice(getObject('linen'))}
                  {displayExtraServicePrice(getObject('towels'))}
                  {displayExtraServicePrice(getObject('hottub'))}
                  {displayExtraServicePrice(getObject('petFee'))}
                  {values.type === 'private' && displayCleaningPrice(getObject('cleaning'))} */}
                </Grid.Column>
              </Grid>
            </Accordion.Content>
          </Accordion>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Extras;

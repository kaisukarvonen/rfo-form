import React, { Fragment, useState } from 'react';
import { Header, Form, Divider, Icon, Grid, Accordion } from 'semantic-ui-react';
import CustomAccordion from './CustomAccordion';

const Extras = ({ values, getObject, showInfo, handleOnChange }) => {
  const [accordions, setAccordions] = useState([9, 3]);

  const handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps;
    const indexInArray = accordions.findIndex(i => i === index);
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

  const displayCleaningPrice = object => {
    return `kesällä ${object.summer} €, talvella huvila ${object.winter.villa} € + ${object.winter.cottage} € / huone mökissä`;
  };

  return (
    <Fragment>
      <Divider />

      {values.visitType === 'meeting' && (
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
            {getObject('programs').fi}
          </Header>
        </Accordion.Title>
        <Accordion.Content active={accordions.includes(3)}>
          <CustomAccordion
            small
            values={values}
            accordions={accordions}
            handleOnChange={handleOnChange}
            handleAccordionClick={handleAccordionClick}
            showInfo={showInfo}
            getObject={getObject}
            title="summer"
            index={4}
            options={getObject('allYearRound').options.concat(getObject('summer').options)}
          />
          <CustomAccordion
            small
            values={values}
            accordions={accordions}
            handleOnChange={handleOnChange}
            handleAccordionClick={handleAccordionClick}
            showInfo={showInfo}
            getObject={getObject}
            title="winter"
            index={5}
            options={getObject('allYearRound').options.concat(getObject('winter').options)}
          />
        </Accordion.Content>
      </Accordion>

      {(!values.locationType || values.locationType === 'villaParatiisi') && (
        <Fragment>
          <Accordion>
            <Accordion.Title active={accordions.includes(8)} index={8} onClick={handleAccordionClick}>
              <Header as="h4">
                <Icon name="dropdown" />
                {getObject('rentalEquipment').fi}
              </Header>
            </Accordion.Title>
            <Accordion.Content active={accordions.includes(8)}>
              <Grid style={{ marginBottom: '1px' }}>
                {getObject('rentalEquipment').options.map(i => (
                  <Grid.Row key={i.key}>
                    <Grid.Column width={9} style={{ maxWidth: '250px' }}>
                      <Form.Checkbox label={i.fi} id={i.key} checked={values[i.key]} onChange={handleOnChange} />
                    </Grid.Column>
                    <Grid.Column width={7}>{displayExtraServicePrice(i, i.priceInfoFi)}</Grid.Column>
                  </Grid.Row>
                ))}
              </Grid>
            </Accordion.Content>
          </Accordion>

          <Accordion>
            <Accordion.Title active={accordions.includes(9)} index={9} onClick={handleAccordionClick}>
              <Header as="h4">
                <Icon name="dropdown" />
                {getObject('extraServices').fi}
              </Header>
            </Accordion.Title>
            <Accordion.Content active={accordions.includes(9)}>
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
                  {values.type === 'company' && (
                    <Form.Checkbox label={getObject('laavu').fi} id="laavu" checked={values.laavu} onChange={handleOnChange} />
                  )}
                </Grid.Column>
                <Grid.Column width={7}>
                  {displayExtraServicePrice(getObject('linen'))}
                  {displayExtraServicePrice(getObject('towels'))}
                  {displayExtraServicePrice(getObject('hottub'))}
                  {displayExtraServicePrice(getObject('petFee'))}
                  {values.type === 'private' && displayCleaningPrice(getObject('cleaning'))}
                  {values.type === 'company' && displayExtraServicePrice(getObject('laavu'), ' / hlö')}
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

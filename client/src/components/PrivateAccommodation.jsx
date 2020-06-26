import 'moment/locale/fi';
import React from 'react';
import { Form, Grid, Input, Label, Message } from 'semantic-ui-react';
import { villaAcommodationTypes } from './Form';

const padded = {
  marginBottom: 8,
};

const showPrice = false;

const PrivateAccommodation = ({
  privatePersonAcommodationPrice,
  numOfNights,
  formData,
  getObject,
  handleOnChange,
  getObjectInList,
  activePeriod,
  showWeekendPrices,
}) => {
  const { onlyWeekend, alsoWeekend } = showWeekendPrices();
  const extraPersons = getObjectInList('extraPersons', 'cottage')[activePeriod];
  const facilitiesStr = '2 huonetta (2+4 hlöä)';
  const facilities = { summer: facilitiesStr, winter: facilitiesStr };
  const acommodationPrices = getObject('acommodationPrices');
  const { cottagesAmount } = formData;
  const cottageInfo = () => {
    const choices = extraPersons.choices;
    return `${choices.length} huonetta, yht. 9 hlöä (${choices.join('+')} hlöä)`;
  };

  const handleOnCottageAmountChange = (e, minus) => {
    let cAmount = cottagesAmount;
    const maxAmount = extraPersons.choices.length;
    if (minus && cAmount) {
      cAmount -= 1;
    }
    if (!minus && cAmount < maxAmount) {
      cAmount += 1;
    }
    handleOnChange(e, { id: 'cottagesAmount', value: cAmount });
  };

  const PriceRow = (label, days, id, price, extraInfo, perNight) => (
    <Grid.Row>
      <Grid.Column width={13}>
        <Form.Checkbox label={`${days}: ${label}`} id={id} checked={formData[id]} onChange={handleOnChange} />
        <i>{extraInfo}</i>
      </Grid.Column>
      <Grid.Column width={2}>
        {price} € {perNight && ' / vrk'}
      </Grid.Column>
    </Grid.Row>
  );

  const {
    villaPrice,
    cottagesPrices,
    acTitle,
    villaFirstNight,
    villaNextNights,
    cottageFirstNight,
    cottageNextNights,
  } = privatePersonAcommodationPrice();

  return (
    <>
      {acommodationPrices.showInfo && (
        <Message>
          <Message.Header>Kesäkausi (touko-lokakuu)</Message.Header>
          <Message.Content style={padded}>
            {facilities.summer} /vrk {acommodationPrices.summer['1']} €, lisäksi 2 hlön huone mökissä{' '}
            {getObjectInList('extraPersons', 'cottage').summer['1']} €/vrk
            <br />
            Lisäpäivät {acommodationPrices.summer['2']} €, lisähuone {getObjectInList('extraPersons', 'cottage').summer['2']}{' '}
            €/vrk
          </Message.Content>
          <Message.Header>Talvikausi (marras-huhtikuu)</Message.Header>
          <Message.Content style={padded}>
            {facilities.winter} /vrk {acommodationPrices.winter['1']} €, lisäksi mökeissä 4 huonetta (9 vuodetta){' '}
            {getObjectInList('extraPersons', 'cottage').winter['1']} €/huone
            <br />
            Lisäpäivät {acommodationPrices.winter['2']} €, lisähuone {getObjectInList('extraPersons', 'cottage').winter['2']}{' '}
            €/vrk
          </Message.Content>
          Joulu ja Uusivuosi kesähinnoittelun mukaan. Hinta sisältää klo 16-12 välisen oleskelun.
        </Message>
      )}
      {formData.locationType === 'villaParatiisi' && formData.from && (
        <Grid className="extra-persons private-acommodation">
          {((onlyWeekend && numOfNights === 1) || alsoWeekend) &&
            PriceRow(
              facilitiesStr,
              villaAcommodationTypes.villaParatiisiWeekend,
              'villaParatiisiWeekend',
              acommodationPrices.weekend['1'],
              `Sisältäen lisähuoneet pihamökeissä: ${cottageInfo()}`
            )}
          {((onlyWeekend && numOfNights > 1) || alsoWeekend) &&
            PriceRow(
              facilitiesStr,
              villaAcommodationTypes.villaParatiisiFullWeekend,
              'villaParatiisiFullWeekend',
              acommodationPrices.weekend['2'],
              `Sisältäen lisähuoneet pihamökeissä: ${cottageInfo()}`
            )}
          {!onlyWeekend &&
            PriceRow(
              facilities[activePeriod],
              villaAcommodationTypes.villaParatiisi,
              'villaParatiisi',
              acommodationPrices[activePeriod]['1'],
              false,
              true
            )}
          {!onlyWeekend && (
            <Grid.Row>
              <Grid.Column width={14} style={{ maxWidth: '390px' }}>
                <b>Lisähuoneet pihamökeissä</b>
                <br />
                {cottageInfo()}
                <div className="cottage-selector">
                  <Input
                    labelPosition="right"
                    max={extraPersons.choices.length}
                    value={`${cottagesAmount} huonetta`}
                    placeholder="0 huonetta"
                    readOnly
                  >
                    <Label as="a" onClick={(e) => handleOnCottageAmountChange(e, true)}>
                      -
                    </Label>
                    <input />
                    <Label as="a" onClick={(e) => handleOnCottageAmountChange(e, false)}>
                      +
                    </Label>
                  </Input>
                </div>
              </Grid.Column>
              <Grid.Column width={2}>{extraPersons['1']} € / huone</Grid.Column>
            </Grid.Row>
          )}
          {formData.villaParatiisi && showPrice && (
            <>
              <Grid.Row>
                <Grid.Column width={14}>
                  <b>{acTitle}</b>
                </Grid.Column>
                <Grid.Column width={2}>{villaPrice + cottagesPrices} €</Grid.Column>
              </Grid.Row>
              {numOfNights > 1 || cottagesAmount ? (
                <>
                  <Grid.Row>
                    <div className="pricing-header">Huvila</div>
                  </Grid.Row>
                  <Grid.Row>
                    {villaFirstNight}
                    <br />
                    {villaNextNights}
                  </Grid.Row>
                  {cottagesAmount ? (
                    <>
                      <Grid.Row>
                        <div className="pricing-header">Lisähuoneet</div>
                      </Grid.Row>
                      <Grid.Row>
                        {cottageFirstNight}
                        <br />
                        {cottageNextNights}
                      </Grid.Row>
                    </>
                  ) : null}
                </>
              ) : null}
            </>
          )}
        </Grid>
      )}
    </>
  );
};

export default PrivateAccommodation;

import React from 'react';
import { Message, Form, Grid, Input, Label, Header } from 'semantic-ui-react';
import 'moment/locale/fi';
import moment from 'moment';

const padded = {
  marginBottom: 8,
};

const PrivateAccommodation = ({
  privatePersonAcommodationPrice,
  numOfNights,
  formData,
  getObject,
  handleOnChange,
  getObjectInList,
  activePeriod,
}) => {
  const extraPersons = getObjectInList('extraPersons', 'cottage')[activePeriod];
  const facilitiesStr = '2 huonetta (2+4 henkilöä)';
  const facilities = { summer: facilitiesStr, winter: facilitiesStr };
  const acommodationPrices = getObject('acommodationPrices');
  const { cottagesAmount } = formData;
  const cottageInfo = () => {
    const choices = extraPersons.choices;
    return `${choices.length} huonetta (${choices.join(' + ')} henkilöä)`;
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
          <Grid.Row>
            <Grid.Column width={14}>
              <Form.Checkbox
                label={facilities[activePeriod]}
                id="villaParatiisi"
                checked={formData.villaParatiisi}
                onChange={handleOnChange}
              />
            </Grid.Column>
            <Grid.Column width={2}>{acommodationPrices[activePeriod]['1']} €</Grid.Column>
          </Grid.Row>
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
          {formData.villaParatiisi && (
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

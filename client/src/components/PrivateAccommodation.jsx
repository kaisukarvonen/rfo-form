import React from 'react';
import { Message, Form, Grid } from 'semantic-ui-react';
import 'moment/locale/fi';

const padded = {
  marginBottom: 8
};

const PrivateAccommodation = ({ formData, getObject, handleOnChange, getObjectInList, handleCottageChange, activePeriod }) => {
  const cottages = getObjectInList('extraPersons', 'cottage');
  const facilities = { summer: '5 huonetta /12 vuodetta + yläsänky', winter: '2 huonetta /5 vuodetta + yläsänky' };
  return (
    <>
      <Message>
        <Message.Header>Kesäkausi (touko-lokakuu)</Message.Header>
        <Message.Content style={padded}>
          {facilities.summer} /vrk {getObject('acommodationPrices').summer['1']} €, lisäksi 2 hlön huone mökissä{' '}
          {getObjectInList('extraPersons', 'cottage').summer['1']} €/vrk
          <br />
          Lisäpäivät {getObject('acommodationPrices').summer['2']} €, lisähuone{' '}
          {getObjectInList('extraPersons', 'cottage').summer['2']} €/vrk
        </Message.Content>
        <Message.Header>Talvikausi (marras-huhtikuu)</Message.Header>
        <Message.Content style={padded}>
          {facilities.winter} /vrk {getObject('acommodationPrices').winter['1']} €, lisäksi mökeissä 4 huonetta (9 vuodetta){' '}
          {getObjectInList('extraPersons', 'cottage').winter['1']} €/huone
          <br />
          Lisäpäivät {getObject('acommodationPrices').winter['2']} €, lisähuone{' '}
          {getObjectInList('extraPersons', 'cottage').winter['2']} €/vrk
        </Message.Content>
        Joulu ja Uusivuosi kesähinnoittelun mukaan. Hinta sisältää klo 16-12 välisen oleskelun.
      </Message>
      {formData.locationType === 'villaParatiisi' && formData.from && (
        <Grid className="extra-persons">
          <Grid.Row>
            <Grid.Column width={14} style={{ maxWidth: '390px' }}>
              <Form.Checkbox
                label={facilities[activePeriod]}
                id="villaParatiisi"
                checked={formData.villaParatiisi}
                onChange={handleOnChange}
              />
            </Grid.Column>
            <Grid.Column width={2}>{getObject('acommodationPrices')[activePeriod]['1']} €</Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={14} style={{ maxWidth: '390px' }}>
              <b>{activePeriod === 'winter' ? 'Lisähuoneet pihamökeissä' : 'Lisähuone'}</b>
              <Form.Group>
                {cottages[activePeriod].choices.map((choice, index) => (
                  <Form.Checkbox
                    label={`${choice} hlön huone`}
                    id={index + 1}
                    checked={formData.cottages[index]}
                    onChange={handleCottageChange}
                  />
                ))}
              </Form.Group>
            </Grid.Column>
            <Grid.Column width={2}>{cottages[activePeriod]['1']} €</Grid.Column>
          </Grid.Row>
        </Grid>
      )}
    </>
  );
};

export default PrivateAccommodation;

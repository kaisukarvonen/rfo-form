import React from 'react';
import { Header, Form, Divider, Icon, Grid, Accordion } from 'semantic-ui-react';
import CustomAccordion from './CustomAccordion';

class Extras extends React.Component {
  state = {
    accordions: [9, 3]
  };

  handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps;
    const indexInArray = this.state.accordions.findIndex(i => i === index);
    const newArray = [...this.state.accordions];
    if (indexInArray !== -1) {
      newArray.splice(indexInArray, 1);
    } else {
      newArray.push(index);
    }
    this.setState({ accordions: newArray });
  };

  displayExtraServicePrice = (object, extra) => {
    const priceField = this.props.values.type === 'company' && object.price ? 'price' : 'alvPrice';
    const alvText = priceField === 'price' ? '+ alv' : '';
    return <p style={{ paddingTop: '2px' }}>{`${object[priceField]} € ${alvText} ${extra || ''}`}</p>;
  };

  displayCleaningPrice = object => {
    return `kesällä ${object.summer} €, talvella huvila ${object.winter.villa} € + ${object.winter.cottage} € / huone mökissä`;
  };

  render() {
    const { values } = this.props;
    const { accordions } = this.state;
    return (
      <React.Fragment>
        <Divider />

        {values.visitType === 'meeting' && (
          <CustomAccordion
            values={values}
            accordions={accordions}
            handleOnChange={this.props.handleOnChange}
            handleAccordionClick={this.handleAccordionClick}
            showInfo={this.props.showInfo}
            getObject={this.props.getObject}
            title="meetingEquipment"
            index={1}
          />
        )}

        <CustomAccordion
          values={values}
          accordions={accordions}
          handleOnChange={this.props.handleOnChange}
          handleAccordionClick={this.handleAccordionClick}
          showInfo={this.props.showInfo}
          getObject={this.props.getObject}
          title="foodOptions"
          index={2}
          extraInfo={'* Huomioimme kaikki erityisruokavaliot'}
        />

        <Accordion>
          <Accordion.Title active={accordions.includes(3)} index={3} onClick={this.handleAccordionClick}>
            <Header as="h4">
              <Icon name="dropdown" />
              {this.props.getObject('programs').fi}
            </Header>
          </Accordion.Title>
          <Accordion.Content active={accordions.includes(3)}>
            <CustomAccordion
              small
              values={values}
              accordions={accordions}
              handleOnChange={this.props.handleOnChange}
              handleAccordionClick={this.handleAccordionClick}
              showInfo={this.props.showInfo}
              getObject={this.props.getObject}
              title="summer"
              index={4}
              options={this.props.getObject('allYearRound').options.concat(this.props.getObject('summer').options)}
            />
            <CustomAccordion
              small
              values={values}
              accordions={accordions}
              handleOnChange={this.props.handleOnChange}
              handleAccordionClick={this.handleAccordionClick}
              showInfo={this.props.showInfo}
              getObject={this.props.getObject}
              title="winter"
              index={5}
              options={this.props.getObject('allYearRound').options.concat(this.props.getObject('winter').options)}
            />
          </Accordion.Content>
        </Accordion>

        <Accordion>
          <Accordion.Title active={accordions.includes(8)} index={8} onClick={this.handleAccordionClick}>
            <Header as="h4">
              <Icon name="dropdown" />
              {this.props.getObject('rentalEquipment').fi}
            </Header>
          </Accordion.Title>
          <Accordion.Content active={accordions.includes(8)}>
            <Grid style={{ marginBottom: '1px' }}>
              {this.props.getObject('rentalEquipment').options.map(i => (
                <Grid.Row key={i.key}>
                  <Grid.Column width={9} style={{ maxWidth: '250px' }}>
                    <Form.Checkbox label={i.fi} id={i.key} checked={values[i.key]} onChange={this.props.handleOnChange} />
                  </Grid.Column>
                  <Grid.Column width={7}>{this.displayExtraServicePrice(i, i.priceInfoFi)}</Grid.Column>
                </Grid.Row>
              ))}
            </Grid>
          </Accordion.Content>
        </Accordion>

        <Accordion>
          <Accordion.Title active={accordions.includes(9)} index={9} onClick={this.handleAccordionClick}>
            <Header as="h4">
              <Icon name="dropdown" />
              {this.props.getObject('extraServices').fi}
            </Header>
          </Accordion.Title>
          <Accordion.Content active={accordions.includes(9)}>
            <Grid style={{ marginBottom: '1px' }}>
              <Grid.Column width={9} style={{ maxWidth: '270px' }}>
                <Form.Checkbox label={this.props.getObject('linen').fi} id="linen" checked={values.linen} onChange={this.props.handleOnChange} />
                <Form.Checkbox label={this.props.getObject('towels').fi} id="towels" checked={values.towels} onChange={this.props.handleOnChange} />
                <Form.Checkbox label={this.props.getObject('hottub').fi} id="hottub" checked={values.hottub} onChange={this.props.handleOnChange} />
                <Form.Checkbox label={this.props.getObject('petFee').fi} id="petFee" checked={values.petFee} onChange={this.props.handleOnChange} />
                {values.type === 'private' && (
                  <Form.Checkbox
                    label={this.props.getObject('cleaning').fi}
                    id="cleaning"
                    checked={values.cleaning}
                    onChange={this.props.handleOnChange}
                  />
                )}
                {values.type === 'company' && (
                  <Form.Checkbox label={this.props.getObject('laavu').fi} id="laavu" checked={values.laavu} onChange={this.props.handleOnChange} />
                )}
              </Grid.Column>
              <Grid.Column width={7}>
                {this.displayExtraServicePrice(this.props.getObject('linen'))}
                {this.displayExtraServicePrice(this.props.getObject('towels'))}
                {this.displayExtraServicePrice(this.props.getObject('hottub'))}
                {this.displayExtraServicePrice(this.props.getObject('petFee'))}
                {values.type === 'private' && this.displayCleaningPrice(this.props.getObject('cleaning'))}
                {values.type === 'company' && this.displayExtraServicePrice(this.props.getObject('laavu'), ' / hlö')}
              </Grid.Column>
            </Grid>
          </Accordion.Content>
        </Accordion>
      </React.Fragment>
    );
  }
}

export default Extras;

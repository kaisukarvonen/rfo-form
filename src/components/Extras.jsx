import React from 'react';
import { Header, Form, Divider, Icon, Grid, Accordion } from 'semantic-ui-react';
import CustomAccordion from './CustomAccordion';
import { lan } from '../utils';

class Extras extends React.Component {
  state = {
    accordions: [],
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
  }

  displayExtraServicePrice = (object) => {
    const priceField = this.props.values.type === 'company' ? 'price' : 'alvPrice';
    const alvText = priceField === 'price' ? `+ ${lan === 'fi' ? 'alv' : 'vat'}` : '';
    return <p>{`${object[priceField]} € ${alvText}`}</p>;
  }


  render() {
    const styles = {
      categoryHeader: {
        cursor: 'pointer',
        width: '180px',
        marginTop: 0,
      },
      categoryItems: {
        padding: '0 0 12px 12px',
      },
    };
    const { values } = this.props;
    const { accordions } = this.state;
    return (
      <React.Fragment>
        <Divider />

        { values.visitType === 'meeting' &&
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
      }

        <CustomAccordion
          values={values}
          accordions={accordions}
          handleOnChange={this.props.handleOnChange}
          handleAccordionClick={this.handleAccordionClick}
          showInfo={this.props.showInfo}
          getObject={this.props.getObject}
          title="foodOptions"
          index={2}
        />
        { lan === 'fi' ? '* Huomioimme kaikki erityisruokavaliot' : '* We cater to all dietary needs '}

        <Header as="h4" dividing>{this.props.getObject('programs')[lan]}</Header>
        <CustomAccordion
          small
          values={values}
          accordions={accordions}
          handleOnChange={this.props.handleOnChange}
          handleAccordionClick={this.handleAccordionClick}
          showInfo={this.props.showInfo}
          getObject={this.props.getObject}
          title="wellbeing"
          index={3}
        />
        <CustomAccordion
          small
          values={values}
          accordions={accordions}
          handleOnChange={this.props.handleOnChange}
          handleAccordionClick={this.handleAccordionClick}
          showInfo={this.props.showInfo}
          getObject={this.props.getObject}
          title="water"
          index={4}
        />
        <CustomAccordion
          small
          values={values}
          accordions={accordions}
          handleOnChange={this.props.handleOnChange}
          handleAccordionClick={this.handleAccordionClick}
          showInfo={this.props.showInfo}
          getObject={this.props.getObject}
          title="forest"
          index={5}
        />
        <CustomAccordion
          small
          values={values}
          accordions={accordions}
          handleOnChange={this.props.handleOnChange}
          handleAccordionClick={this.handleAccordionClick}
          showInfo={this.props.showInfo}
          getObject={this.props.getObject}
          title="otherPrograms"
          index={6}
        />
        <CustomAccordion
          small
          values={values}
          accordions={accordions}
          handleOnChange={this.props.handleOnChange}
          handleAccordionClick={this.handleAccordionClick}
          showInfo={this.props.showInfo}
          getObject={this.props.getObject}
          title="workplaceTraining"
          index={7}
        />

        <Divider />


        <Accordion>
          <Accordion.Title active={accordions.includes(8)} index={8} onClick={this.handleAccordionClick}>
            <Header as="h4"><Icon name="dropdown" />{this.props.getObject('rentalEquipment')[lan]}</Header>
          </Accordion.Title>
          <Accordion.Content active={accordions.includes(8)}>
            <Grid style={{ marginBottom: '1px' }}>
              {this.props.getObject('rentalEquipment').options.map(i =>
                  (
                    <Grid.Row>
                      <Grid.Column width={4}>
                        <Form.Checkbox label={i[lan]} id={i.key} checked={values[i.key]} onChange={this.props.handleOnChange} />
                      </Grid.Column>
                      <Grid.Column width={4} >
                        {lan === 'fi' ? i.priceInfoFi : i.priceInfoEn}
                      </Grid.Column>
                    </Grid.Row>
                ))}
            </Grid>
          </Accordion.Content>
        </Accordion>

        <Accordion>
          <Accordion.Title active={accordions.includes(9)} index={9} onClick={this.handleAccordionClick}>
            <Header as="h4"><Icon name="dropdown" />{this.props.getObject('extraServices')[lan]}</Header>
          </Accordion.Title>
          <Accordion.Content active={accordions.includes(9)}>
            <Grid style={{ marginBottom: '1px' }}>
              <Grid.Column width={4}>
                <Form.Checkbox label={this.props.getObject('linen')[lan]} id="linen" checked={values.linen} onChange={this.props.handleOnChange} />
                <Form.Checkbox label={this.props.getObject('towels')[lan]} id="towels" checked={values.towels} onChange={this.props.handleOnChange} />
                <Form.Checkbox label={this.props.getObject('hottub')[lan]} id="hottub" checked={values.hottub} onChange={this.props.handleOnChange} />
              </Grid.Column>
              <Grid.Column width={3}>
                {this.displayExtraServicePrice(this.props.getObject('linen'))}
                {this.displayExtraServicePrice(this.props.getObject('towels'))}
                {this.displayExtraServicePrice(this.props.getObject('hottub'))}
              </Grid.Column>
            </Grid>
          </Accordion.Content>
        </Accordion>

      </React.Fragment>
    );
  }
}

export default Extras;

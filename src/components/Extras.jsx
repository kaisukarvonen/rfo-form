import React from 'react';
import { Header, Form, Divider, Icon, Grid, Accordion, Checkbox } from 'semantic-ui-react';
import _ from 'lodash';
import InfoPopup from './InfoPopup';
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
        <Accordion>
          <Accordion.Title active={accordions.includes(2)} index={2} onClick={this.handleAccordionClick}>
            <Header as="h4"><Icon name="dropdown" />{this.props.getObject('foodOptions')[lan]}</Header>
          </Accordion.Title>
          <Accordion.Content active={accordions.includes(2)}>
            {this.props.getObject('foodOptions').options.map(i => (
              <Form.Field inline>
                <Checkbox label={i[lan]} id={i.key} checked={this.state[i.key]} onChange={this.props.handleOnChange} />
                { this.props.showInfo(i) && <InfoPopup icon="info circle" content={this.props.showInfo(i)} /> }
              </Form.Field>
            ))}
          </Accordion.Content>
        </Accordion>
        <Accordion>
          <Accordion.Title active={accordions.includes(1)} index={1} onClick={this.handleAccordionClick}>
            <Header as="h4"><Icon name="dropdown" />{this.props.getObject('servicesTitle')[lan]}</Header>
          </Accordion.Title>
          <Accordion.Content active={accordions.includes(1)}>
            <Grid style={{ marginBottom: '1px' }}>
              <Grid.Column width={5}>
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
        {/* {{ this.state.type === 'company' && this.state.visitType === 'meeting' &&
          <p style={styles.categoryHeader} onClick={() => { this.setState({ showMeetingEquipment: !this.state.showMeetingEquipment }); }}>
              {this.getObject('meetingEquipment')[lan]}
            <Icon name="angle down" />
          </p>
            }
          { this.state.showMeetingEquipment &&
            <div style={styles.categoryItems}>
              {this.getObject('meetingEquipment').options.map(i =>
                <SemanticForm.Checkbox label={i[lan]} id={i.key} checked={this.state[i.key]} onChange={this.handleOnChange} />)}
            </div>}
          <Header as="h5">{this.getObject('foodOptions')[lan]}</Header>
          <Accordion>
            <Accordion.Title active={this.state.activeIndex === 0} index={0} onClick={this.handleAccordionClick}>
              <Icon name="angle up" />
          What is a dog?
            </Accordion.Title>
            <Accordion.Content active={this.state.activeIndex === 0}>
              <p>
            A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can
            be found as a welcome guest in many households across the world.
              </p>
            </Accordion.Content>
          </Accordion>


          <Header as="h5">{this.getObject('activityTitle')[lan]}</Header>
          <p style={styles.categoryHeader} onClick={() => { this.setState({ showRental: !this.state.showRental }); }}>{this.getObject('rentalTitle')[lan]} <Icon name="angle down" /></p>
          {this.state.showRental &&
            <div style={styles.categoryItems}>
              {this.getObject('rentalTitle').options.map(i =>
                <SemanticForm.Checkbox label={i[lan]} id={i.key} checked={this.state[i.key]} onChange={this.handleOnChange} />)}
            </div>
          }
          { this.getObject('activityOptions').options.map(i =>
            <SemanticForm.Checkbox label={i[lan]} id={i.key} checked={this.state[i.key]} onChange={this.handleOnChange} />)
          } */}
      </React.Fragment>
    );
  }
}

export default Extras;

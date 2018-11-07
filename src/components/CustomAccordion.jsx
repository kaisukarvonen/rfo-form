import React from 'react';
import { Header, Form, Icon, Accordion, Checkbox } from 'semantic-ui-react';
import InfoPopup from './InfoPopup';
import { lan } from '../utils';

const CustomAccordion = (props) => {
  const { values, accordions, title, index } = props;
  return (
    <Accordion>
      <Accordion.Title active={accordions.includes(index)} index={index} onClick={props.handleAccordionClick}>
        <Header as={props.small ? 'h5' : 'h4'}><Icon name="dropdown" />{props.getObject(title)[lan]}</Header>
      </Accordion.Title>
      <Accordion.Content active={accordions.includes(index)}>
        {props.getObject(title).options.map(i => (
          <React.Fragment>
            <Form.Field inline>
              <Checkbox label={i[lan]} id={i.key} checked={values[i.key]} onChange={props.handleOnChange} />
              { props.showInfo(i) && <InfoPopup icon="info circle" content={props.showInfo(i)} /> }
            </Form.Field>
            {i.spaceAfter && <br/>}
          </React.Fragment>
            ))}
      </Accordion.Content>
    </Accordion>
  );
};

export default CustomAccordion;

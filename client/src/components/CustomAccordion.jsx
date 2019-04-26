import React from 'react';
import { Header, Form, Icon, Accordion, Checkbox } from 'semantic-ui-react';
import InfoPopup from './InfoPopup';

const CustomAccordion = props => {
  const { values, accordions, title, index } = props;
  const options = props.options || props.getObject(title).options;
  return (
    <Accordion>
      <Accordion.Title active={accordions.includes(index)} index={index} onClick={props.handleAccordionClick}>
        <Header as={props.small ? 'h5' : 'h4'}>
          <Icon name="dropdown" />
          {props.getObject(title).fi}
        </Header>
      </Accordion.Title>
      <Accordion.Content active={accordions.includes(index)}>
        {options.map(i => (
          <React.Fragment key={i.key}>
            <Form.Field inline>
              <Checkbox label={i.fi} id={i.key} checked={values[i.key]} onChange={props.handleOnChange} />
              {props.showInfo(i) && <InfoPopup icon="info circle" content={props.showInfo(i)} />}
            </Form.Field>
            {i.spaceAfter && <br />}
          </React.Fragment>
        ))}
        <p>{props.extraInfo && props.extraInfo}</p>
      </Accordion.Content>
    </Accordion>
  );
};

export default CustomAccordion;

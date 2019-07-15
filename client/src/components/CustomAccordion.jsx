import React from 'react';
import { Header, Form, Icon, Accordion, Checkbox } from 'semantic-ui-react';
import InfoPopup from './InfoPopup';

const CustomAccordion = ({
  values,
  accordions,
  title,
  index,
  options,
  getObject,
  small,
  showInfo,
  handleOnChange,
  extraInfo,
  handleAccordionClick
}) => {
  const displayOptions = options || getObject(title).options;
  return (
    <Accordion>
      <Accordion.Title active={accordions.includes(index)} index={index} onClick={handleAccordionClick}>
        <Header as={small ? 'h5' : 'h4'}>
          <Icon name="dropdown" />
          {getObject(title).fi}
        </Header>
      </Accordion.Title>
      <Accordion.Content active={accordions.includes(index)}>
        {displayOptions.map(i => (
          <React.Fragment key={i.key}>
            <Form.Field inline>
              <Checkbox label={i.fi} id={i.key} checked={values[i.key]} onChange={handleOnChange} />
              {showInfo(i) && <InfoPopup icon="info circle" content={showInfo(i)} />}
            </Form.Field>
            {i.spaceAfter && <br />}
          </React.Fragment>
        ))}
        <p>{extraInfo && extraInfo}</p>
      </Accordion.Content>
    </Accordion>
  );
};

export default CustomAccordion;

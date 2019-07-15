import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';

const InfoPopup = ({ icon, content }) => {
  return <Popup flowing hoverable size="small" trigger={<Icon name={icon} />} content={content} />;
};

export default InfoPopup;

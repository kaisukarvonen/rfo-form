import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';


class InfoPopup extends React.Component {
  state = {

  };

  render() {
    return (
      <Popup
        size="small"
        trigger={<Icon name={this.props.icon} />}
        content={this.props.content}
      />
    );
  }
}

export default InfoPopup;

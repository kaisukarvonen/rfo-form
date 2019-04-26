import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Icon, Transition } from 'semantic-ui-react';
import { lan } from '../utils';

const propTypes = {
  notification: PropTypes.object,
};

const defaultProps = {
  notification: {},
};

class Notification extends React.Component {
  state = { visible: true };

  hideTransition = () => {
    this.setState({ visible: false });
  }


  render() {
    const successMsg = lan === 'fi' ? 'Kiitos yhteydenotostasi, otamme teihin yhteyttä mahdollisimman pian.' :
    'Thank you for contacting us! We will be in touch with you shortly.';
    const errorMsg = lan === 'fi' ? 'Viestiäsi ei valitettavasti voitu lähettää, yritä myöhemmin uudelleen' :
     'Unfortunately your message was not sent, please try again later';
    return (
      <Transition
        visible={this.state.visible}
        unmountOnHide
        transitionOnMount
        onHide={this.props.hideNotification}
      >

        <Modal
          dimmer="inverted"
          size="small"
          open
        >
          <Modal.Content>
            <Icon link name="close" style={{ float: 'right' }} onClick={this.hideTransition} />
            <p style={{ fontSize: '16px' }}>
              { this.props.notification.success ? successMsg :
              <React.Fragment><Icon name="exclamation triangle" /> {errorMsg}</React.Fragment> }
            </p>
          </Modal.Content>
        </Modal>
      </Transition>
    );
  }
}

Notification.propTypes = propTypes;
Notification.defaultProps = defaultProps;
export default Notification;

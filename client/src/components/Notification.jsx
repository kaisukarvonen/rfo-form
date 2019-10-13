import React, { useState } from 'react';
import { Modal, Icon, Transition } from 'semantic-ui-react';

const Notification = ({ hideNotification, notification }) => {
  const [visible, setVisibility] = useState(true);

  const successMsg = 'Kiitos yhteydenotostasi, otamme teihin yhteyttä mahdollisimman pian.';
  const errorMsg = 'Viestiäsi ei valitettavasti voitu lähettää, yritä myöhemmin uudelleen';
  return (
    <Transition visible={visible} unmountOnHide transitionOnMount onHide={hideNotification}>
      <Modal dimmer="inverted" size="small" open>
        <Modal.Content>
          <Icon link name="close" style={{ float: 'right' }} onClick={() => setVisibility(false)} />
          <p style={{ fontSize: '16px' }}>
            {notification.success ? (
              successMsg
            ) : (
              <React.Fragment>
                <Icon name="exclamation triangle" /> {errorMsg}
              </React.Fragment>
            )}
          </p>
        </Modal.Content>
      </Modal>
    </Transition>
  );
};

export default Notification;

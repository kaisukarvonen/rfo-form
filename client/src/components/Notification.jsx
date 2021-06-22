import React, { useState } from 'react';
import { Modal, Icon, Transition } from 'semantic-ui-react';

const Notification = ({ hideNotification, notification }) => {
  const [visible, setVisibility] = useState(true);

  const successMsg = 'Kiitokset yhteydenotostasi, pyrimme vastaamaan sinulle vuorokauden sisällä maanantaista perjantaihin.';
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
              <>
                <Icon name="exclamation triangle" /> {errorMsg}
              </>
            )}
          </p>
        </Modal.Content>
      </Modal>
    </Transition>
  );
};

export default Notification;

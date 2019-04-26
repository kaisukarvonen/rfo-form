const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';
const HIDE_NOTIFICATION = 'HIDE_NOTIFICATION';

export const showNotification = notification => ({ type: SHOW_NOTIFICATION, notification });
export const hideNotification = () => ({ type: HIDE_NOTIFICATION });


const defaultState = { notification: {} };

export default function (state = defaultState, action) {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return { ...state, notification: action.notification };
    case HIDE_NOTIFICATION:
      return { ...state, notification: {} };
    default:
      return { ...state };
  }
}

import { takeLatest, call, put } from 'redux-saga/effects';
import send from './api/mail';
import { showNotification } from './notification';

const SEND_MAIL = 'SEND_MAIL';
const SENDED_MAIL = 'SENDED_MAIL';


export const sendMail = (email, html) => ({ type: SEND_MAIL, email, html });
export const sendedMail = () => ({ type: SENDED_MAIL });

const defaultState = { sendingEmail: false };

export default function (state = defaultState, action) {
  switch (action.type) {
    case SEND_MAIL:
      return { ...state, sendingEmail: true };
    case SENDED_MAIL:
      return { ...state, sendingEmail: false };
    default:
      return { ...state };
  }
}

function* sendMailWorker(action) {
  try {
    const response = yield call(send, action);
    yield put(sendedMail());
    if (response.status === 200) {
      yield put(showNotification({ success: true }));
    } else {
      yield put(showNotification({ success: false }));
    }
  } catch (e) {
    yield put(showNotification({ success: false }));
  }
}

export const mailSagas = [
  takeLatest(SEND_MAIL, sendMailWorker),
];

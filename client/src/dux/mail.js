import { takeLatest, call, put } from 'redux-saga/effects';
import { sendMail as send, sendMailCopyToCustomer } from './api/mail';
import { showNotification } from './notification';

const SEND_MAIL = 'SEND_MAIL';
const SENDED_MAIL = 'SENDED_MAIL';

export const sendMail = (email, title, html) => ({ type: SEND_MAIL, email, title, html });
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
    if (response.status === 200 && !response.data.responseCode) {
      yield call(sendMailCopyToCustomer, action);
      yield put(showNotification({ success: true }));
    } else {
      yield put(showNotification({ success: false }));
    }
  } catch (e) {
    yield put(showNotification({ success: false }));
  }
}

export function* watchLastSendMail() {
  yield takeLatest(SEND_MAIL, sendMailWorker);
}

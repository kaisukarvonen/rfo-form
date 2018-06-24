import { takeLatest, call, put } from 'redux-saga/effects';
import send from './api/mail';
import { showNotification } from './notification';

const SEND_MAIL = 'SEND_MAIL';

export const sendMail = (email, html) => ({ type: SEND_MAIL, email, html });

function* sendMailWorker(action) {
  try {
    const response = yield call(send, action);
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

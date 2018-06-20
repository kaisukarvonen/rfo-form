import { takeLatest, call } from 'redux-saga/effects';
import send from './api/mail';

const SEND_MAIL = 'SEND_MAIL';

export const sendMail = (email, html) => ({ type: SEND_MAIL, email, html });

function* sendMailWorker(action) {
  try {
    const response = yield call(send, action);
    if (response.status === 200) {
      // successfull!
    } else {
    // yield put(fetchMessage({ value: 'Fetching activities failed', error: true }));
    }
  } catch (e) {
  // yield put(fetchMessage({ value: 'Fetching activities failed', error: true }));
  }
}

export const mailSagas = [
  takeLatest(SEND_MAIL, sendMailWorker),
];

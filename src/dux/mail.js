import { takeLatest, call } from 'redux-saga/effects';
import fetch from './api/fields';

const SEND_MAIL = 'SEND_MAIL';

export const sendMail = () => ({ type: SEND_MAIL });

function* sendMailWorker() {
  try {
    const response = yield call(fetch);
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

import { all } from 'redux-saga/effects';
import { watchLastFetchFields } from './fields';
import { watchLastSendMail } from './mail';

export default function* rootSaga() {
  yield all([watchLastFetchFields(), watchLastSendMail()]);
}

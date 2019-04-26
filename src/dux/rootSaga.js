import { fieldSagas } from './fields';
import { mailSagas } from './mail';


export default function* rootSaga() {
  yield [
    fieldSagas,
    mailSagas,
  ];
}

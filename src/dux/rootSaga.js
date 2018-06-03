import { fieldSagas } from './fields';


export default function* rootSaga() {
  yield [
    fieldSagas,
  ];
}

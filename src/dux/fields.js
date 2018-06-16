import { takeLatest, call, put } from 'redux-saga/effects';
import fetch from './api/fields';

const FETCH_FIELDS = 'FETCH_FIELDS';
const FETCHED_FIELDS = 'FETCHED_FIELDS';

export const fetchFields = () => ({ type: FETCH_FIELDS });
export const fetchedFields = fieldValues => ({ type: FETCHED_FIELDS, fields: fieldValues });


const defaultState = { fields: [] };

export default function (state = defaultState, action) {
  switch (action.type) {
    case FETCHED_FIELDS:
      return { ...state, fields: action.fields };
    default:
      return { ...state };
  }
}


function* fetchFieldsWorker() {
  try {
    const response = yield call(fetch);
    if (response.status === 200) {
      yield put(fetchedFields(response.data));
    } else {
    // yield put(fetchMessage({ value: 'Fetching activities failed', error: true }));
    }
  } catch (e) {
  // yield put(fetchMessage({ value: 'Fetching activities failed', error: true }));
  }
}

export const fieldSagas = [
  takeLatest(FETCH_FIELDS, fetchFieldsWorker),
];

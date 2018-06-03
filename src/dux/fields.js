import { takeLatest, call, put } from 'redux-saga/effects';
import { enFields, finFields } from './fieldData';

const FETCH_FIELDS = 'FETCH_FIELDS';
const FETCHED_FIELDS = 'FETCHED_FIELDS';

export const fetchFields = language => ({ type: FETCH_FIELDS, language });
export const fetchedFields = fieldValues => ({ type: FETCHED_FIELDS, fields: fieldValues });


const defaultState = {};

export default function (state = defaultState, action) {
  switch (action.type) {
    case FETCHED_FIELDS:
      return { ...state, fields: action.fields };
    default:
      return { ...state };
  }
}


function* fetchFieldsWorker(action) {
  if (action.language === 'fi') {
    yield put(fetchedFields(finFields));
  } else {
    yield put(fetchedFields(enFields));
  }
}

export const fieldSagas = [
  takeLatest(FETCH_FIELDS, fetchFieldsWorker),
];

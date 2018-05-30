import { takeLatest, call, put } from 'redux-saga/effects';

const FETCH_FIELDS = 'FETCH_FIELDS';
const FETCHED_FIELDS = 'FETCHED_FIELDS';

export const fetchFields = () => ({ type: FETCH_FIELDS });
export const fetchedFields = fieldValues => ({ type: FETCHED_FIELDS, fields: fieldValues });


const defaultState = {};

export default function fields(state = defaultState, action) {
  switch (action.type) {
    default:
      return { ...state };
  }
}


function* fetchFieldsWorker() {
}

export const fieldSagas = [
];

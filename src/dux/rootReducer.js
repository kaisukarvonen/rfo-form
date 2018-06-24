import { combineReducers } from 'redux';
import fields from './fields';
import notification from './notification';

const rootReducer = combineReducers({
  fields,
  notification,
});
export default rootReducer;

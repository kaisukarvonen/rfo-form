import { combineReducers } from 'redux';
import fields from './fields';
import mail from './mail';
import notification from './notification';

const rootReducer = combineReducers({
  fields,
  notification,
  mail,
});
export default rootReducer;

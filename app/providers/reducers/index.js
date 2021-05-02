import { combineReducers } from 'redux';
import userReducer from './User';
import permissionsReducer from './Permissions';

export default combineReducers({
  userReducer,
  permissionsReducer,
});

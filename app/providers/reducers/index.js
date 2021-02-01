import { combineReducers } from 'redux';
import userReducer from './User';
import barberReducer from './Barber';
import clientReducer from './Client';
import permissionsReducer from './Permissions';

export default combineReducers({
  userReducer,
  barberReducer,
  clientReducer,
  permissionsReducer,
});

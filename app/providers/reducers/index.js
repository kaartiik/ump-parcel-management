import { combineReducers } from 'redux';
import userReducer from './User';
import barberReducer from './Barber';
import clientReducer from './Client';

export default combineReducers({
  userReducer,
  barberReducer,
  clientReducer,
});

import { combineReducers } from 'redux';
import userReducer from './User';
import barberReducer from './Barber';

export default combineReducers({
  userReducer,
  barberReducer,
});

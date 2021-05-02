import { combineReducers } from 'redux';
import userReducer from './User';
import productReducer from './Product';
import permissionsReducer from './Permissions';

export default combineReducers({
  userReducer,
  productReducer,
  permissionsReducer,
});

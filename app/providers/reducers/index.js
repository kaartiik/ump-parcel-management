import { combineReducers } from 'redux';
import userReducer from './User';
import recipeReducer from './Recipes';

export default combineReducers({
  userReducer,
  recipeReducer,
});

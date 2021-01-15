import { all } from 'redux-saga/effects';
import User from './User';
import Recipes from './Recipes';

export default function* rootSaga() {
  yield all([User(), Recipes()]);
}

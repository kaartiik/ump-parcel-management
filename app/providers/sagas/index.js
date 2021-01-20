import { all } from 'redux-saga/effects';
import User from './User';
import Barber from './Barber';

export default function* rootSaga() {
  yield all([User(), Barber()]);
}

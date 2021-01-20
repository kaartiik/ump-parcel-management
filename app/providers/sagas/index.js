import { all } from 'redux-saga/effects';
import User from './User';
import Barber from './Barber';
import Client from './Client';

export default function* rootSaga() {
  yield all([User(), Barber(), Client()]);
}

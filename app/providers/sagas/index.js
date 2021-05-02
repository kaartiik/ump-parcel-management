import { all } from 'redux-saga/effects';
import User from './User';
import Product from './Product';
import AllPermissions from './Permissions';

export default function* rootSaga() {
  yield all([User(), Product(), AllPermissions()]);
}

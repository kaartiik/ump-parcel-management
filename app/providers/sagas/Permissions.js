/* eslint-disable no-alert */
/* eslint-disable no-console */
import { put, fork, call, takeLatest } from 'redux-saga/effects';
// import { eventChannel } from 'redux-saga';
import * as Permissions from 'expo-permissions';
import { actions, putNotificationPermission } from '../actions/Permissions';

function* checkPermissionsSaga() {
  const { status: locationStatus } = yield call(
    Permissions.getAsync,
    Permissions.LOCATION
  );

  const { status: notificationStatus } = yield call(
    Permissions.getAsync,
    Permissions.NOTIFICATIONS
  );

  if (locationStatus !== 'granted') {
    const { status: reStatus } = yield call(
      Permissions.askAsync,
      Permissions.LOCATION
    );

    if (reStatus !== 'granted') {
      alert(`We need location permission to make this work`);
    } else {
      yield put(putNotificationPermission(true));
    }
  }

  if (notificationStatus !== 'granted') {
    const { status: reStatus } = yield call(
      Permissions.askAsync,
      Permissions.NOTIFICATIONS
    );

    if (reStatus !== 'granted') {
      alert(`We need notifications permission to make this work`);
    } else {
      yield put(putNotificationPermission(true));
    }
  }
}

export default function* AllPermissions() {
  yield fork(checkPermissionsSaga);
  yield takeLatest(actions.GET_PERMISSIONS, checkPermissionsSaga);
}

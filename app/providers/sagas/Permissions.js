/* eslint-disable no-alert */
/* eslint-disable no-console */
import { put, fork, call, takeLatest } from 'redux-saga/effects';
// import { eventChannel } from 'redux-saga';
import * as Permissions from 'expo-permissions';
import * as Calendar from 'expo-calendar';
import { actions, putNotificationPermission } from '../actions/Permissions';

function* checkPermissionsSaga() {
  const { status: notificationStatus } = yield call(
    Permissions.getAsync,
    Permissions.NOTIFICATIONS
  );

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

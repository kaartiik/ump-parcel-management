/* eslint-disable no-alert */
/* eslint-disable no-console */
import { put, fork, call, takeLatest } from 'redux-saga/effects';
// import { eventChannel } from 'redux-saga';
import * as Permissions from 'expo-permissions';
import * as Calendar from 'expo-calendar';
import {
  actions,
  putCalendarId,
  putCalendarPermission,
  putNotificationPermission,
} from '../actions/Permissions';

async function createCalendar() {
  const defaultCalendarSource = { isLocalAccount: true, name: 'Expo Calendar' };
  const newCalendarID = await Calendar.createCalendarAsync({
    title: 'Expo Calendar',
    color: 'blue',
    source: defaultCalendarSource,
    name: 'internalCalendarName',
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
    timeZone: 'Asia/Kuala_Lumpur',
  });
  return newCalendarID;
}

function* checkPermissionsSaga() {
  const { status: calendarStatus } = yield call(
    Permissions.getAsync,
    Permissions.CALENDAR
  );
  const { status: notificationStatus } = yield call(
    Permissions.getAsync,
    Permissions.NOTIFICATIONS
  );

  if (calendarStatus !== 'granted') {
    const { status: reStatus } = yield call(
      Permissions.askAsync,
      Permissions.CALENDAR
    );

    if (reStatus !== 'granted') {
      alert(`We need calendar permission to make this work`);
    } else {
      yield put(putCalendarPermission(true));
      const calendarID = yield call(createCalendar);
      yield put(putCalendarId(calendarID));
      console.log(`new calednar ${calendarID}`);
    }
  } else {
    yield put(putCalendarPermission(true));
    const calendars = yield call(Calendar.getCalendarsAsync);
    const appCalendar = calendars.find(
      (item) => item.title === 'Expo Calendar'
    );
    yield put(putCalendarId(appCalendar.id));
    console.log(appCalendar.id);
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

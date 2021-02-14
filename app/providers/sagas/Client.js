/* eslint-disable no-alert */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable camelcase */
/* eslint-disable no-console */
import {
  call,
  put,
  take,
  select,
  takeLatest,
  all,
  fork,
} from 'redux-saga/effects';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import rsf, { database } from '../config';
import * as Calendar from 'expo-calendar';
import {
  actions,
  putBarberShops,
  putBookings,
  putLoadingStatus,
} from '../actions/Client';

import * as Notifications from 'expo-notifications';

dayjs.extend(customParseFormat);

const getUuidFromState = (state) => state.userReducer.uuid;

const getCalendarIdFromState = (state) => state.permissionsReducer.calendarId;

const getUserAvatarFromState = (state) => state.userReducer.avatar;

const fetchNewBookingKey = (barberShopUid) =>
  database.ref('barber_shops').child(barberShopUid).push().key;

function* getBarberShopsSaga() {
  yield put(putLoadingStatus(true));
  try {
    const data = yield call(rsf.database.read, `barber_shops`);
    const exists = data !== null && data !== undefined;
    if (exists) {
      const shopsArr = Object.values(data);

      yield put(putBarberShops(shopsArr));
      yield put(putLoadingStatus(false));
    }
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error retrieving barber shops! ${error}`);
  }
}

function* confirmBookingSaga({ payload }) {
  yield put(putLoadingStatus(true));
  const calendarId = yield select(getCalendarIdFromState);

  const {
    shopUid,
    ownerUuid,
    service,
    timestamp,
    uuid,
    userName,
    userMobile,
    userEmail,
  } = payload;

  const bookingKey = yield call(fetchNewBookingKey, shopUid);

  const bookingObject = {
    service,
    booking_time: timestamp,
    booking_uid: bookingKey,
    client_uid: uuid,
    client_name: userName,
    client_mobile: userMobile,
    client_email: userEmail,
    shop_uid: shopUid,
    owner_uuid: ownerUuid,
    status: 'Pending',
  };

  try {
    yield call(
      rsf.database.update,
      `barber_shops/${shopUid}/bookings/${bookingKey}`,
      bookingObject
    );
    yield call(
      rsf.database.update,
      `users/${uuid}/bookings/${bookingKey}`,
      bookingObject
    );

    const details = {
      title: 'Barber Shop Appointment',
      startDate: new Date(timestamp),
      endDate: new Date(timestamp),
      allDay: true,
      timeZone: 'Asia/Kuala_Lumpur',
    };

    // const localNotification = {
    //   title: 'Barber Shop Appointment',
    //   body: `${dayjs(timestamp).format('DD-MM-YYYY hh:mm A')}`,
    // };

    // const schedulingOptions = {
    //   time: new Date().getTime() - 60000,
    // };

    // console.log(JSON.stringify(schedulingOptions));

    // Notifications show only when app is not active.
    // (ie. another app being used or device's screen is locked)

    yield call(Notifications.scheduleNotificationAsync, {
      content: {
        title: 'Barber Shop Appointment',
        body: `${dayjs(timestamp).format('DD-MM-YYYY hh:mm A')}`,
      },
      trigger: {
        seconds: (timestamp - Date().getTime()) / 1000,
      },
    });

    yield call(Calendar.createEventAsync, calendarId, details);

    yield put(putLoadingStatus(false));

    alert(`Booking made!`);
  } catch (error) {
    yield put(putLoadingStatus(false));

    alert(`Failed to make booking. Please try again. ${error}`);
  }
}

function* getMyBookingsSaga() {
  yield put(putLoadingStatus(true));

  const uuid = yield select(getUuidFromState);

  try {
    const bookingsObj = yield call(rsf.database.read, `users/${uuid}/bookings`);
    const bookingsArr =
      bookingsObj !== null && bookingsObj !== undefined
        ? Object.values(bookingsObj)
        : [];

    const bookingsArrFormated = yield all(
      bookingsArr.map(function* (booking) {
        const shopInfo = yield call(
          rsf.database.read,
          `barber_shops/${booking.shop_uid}`
        );

        delete shopInfo['bookings'];

        const bookingWithShop = {
          ...booking,
          ...shopInfo,
        };
        return bookingWithShop;
      })
    );

    yield put(putBookings(bookingsArrFormated));
    yield put(putLoadingStatus(false));
  } catch (error) {
    yield put(putLoadingStatus(false));
    console.log(error);
    alert(`Error retrieving bookings! ${error}`);
  }
}

export default function* Client() {
  // yield fork(getPostsSaga);
  yield all([
    takeLatest(actions.GET.BARBER_SHOPS, getBarberShopsSaga),
    takeLatest(actions.CONFIRM_BOOKING, confirmBookingSaga),
    takeLatest(actions.GET.BOOKINGS, getMyBookingsSaga),
  ]);
}

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
import {
  actions,
  putBarberShops,
  putBookings,
  putLoadingStatus,
} from '../actions/Client';

dayjs.extend(customParseFormat);

const getUuidFromState = (state) => state.userReducer.uuid;

const getUserNameFromState = (state) => state.userReducer.name;

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

  const {
    shopUid,
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
    client_uid: uuid,
    client_name: userName,
    client_mobile: userMobile,
    client_email: userEmail,
    shop_uid: shopUid,
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
    const bookingsArr = Object.values(bookingsObj);

    console.log(bookingsArr);

    yield put(putBookings(bookingsArr));
    yield put(putLoadingStatus(false));
  } catch (error) {
    yield put(putLoadingStatus(false));
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

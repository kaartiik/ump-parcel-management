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
  putBarberShop,
  putBarberBookings,
  putLoadingStatus,
} from '../actions/Barber';
import { navigate, reset } from '../services/NavigatorService';

dayjs.extend(customParseFormat);

const getShopFromState = (state) => state.barberReducer.barberShop;

const getUuidFromState = (state) => state.userReducer.uuid;

const getIsAdminFromState = (state) => state.userReducer.isAdmin;

const fetchNewShopKey = () => database.ref('barber_shops').push().key;

function* getBarberShopInfoSaga() {
  yield put(putLoadingStatus(true));
  try {
    const uuid = yield select(getUuidFromState);
    const isAdmin = yield select(getIsAdminFromState);

    if (!isAdmin) {
      reset('Home');
      return;
    }

    console.log(uuid);
    const data = yield call(rsf.database.read, `users/${uuid}/barber_shops`);

    const exists = data !== null && data !== undefined;
    if (exists) {
      console.log(data);
      yield put(putBarberShop(data));
      yield put(putLoadingStatus(false));
      reset('HomeBarber');
    } else {
      yield put(putLoadingStatus(false));
      reset('Info', { screen: 'AddShop' });
    }
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error retrieving new barber shop! ${error}`);
  }
}

function* addBarberShopSaga({ payload }) {
  yield put(putLoadingStatus(true));
  try {
    const {
      shopName,
      shopAddress,
      shopContact,
      services,
      shopOpenTime,
      shopCloseTime,
      onSuccess,
    } = payload;
    const shopKey = yield select(fetchNewShopKey);
    const uuid = yield select(getUuidFromState);

    const barberShopObj = {
      shop_name: shopName,
      shop_address: shopAddress,
      shop_contact: shopContact,
      services: services,
      shop_open_time: shopOpenTime,
      shop_close_time: shopCloseTime,
      shop_uid: shopKey,
    };

    yield call(rsf.database.update, `barber_shops/${shopKey}`, barberShopObj);

    yield call(
      rsf.database.update,
      `users/${uuid}/barber_shops`,
      barberShopObj
    );

    yield call(getBarberShopInfoSaga);
    yield put(putLoadingStatus(false));
    onSuccess();
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error adding shop. ${error}`);
  }
}

function* editBarberShopSaga({ payload }) {
  yield put(putLoadingStatus(true));
  try {
    const {
      shopUid,
      shopName,
      shopAddress,
      shopContact,
      services,
      shopOpenTime,
      shopCloseTime,
      onSuccess,
    } = payload;
    const uuid = yield select(getUuidFromState);

    const barberShopObj = {
      shop_name: shopName,
      shop_address: shopAddress,
      shop_contact: shopContact,
      services: services,
      shop_open_time: shopOpenTime,
      shop_close_time: shopCloseTime,
      shop_uid: shopUid,
    };

    yield call(rsf.database.update, `barber_shops/${shopUid}`, barberShopObj);

    yield call(
      rsf.database.update,
      `users/${uuid}/barber_shops`,
      barberShopObj
    );

    yield call(getBarberShopInfoSaga);
    yield put(putLoadingStatus(false));
    onSuccess();
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error adding shop. ${error}`);
  }
}

function* getBarberBookingsSaga() {
  yield put(putLoadingStatus(true));

  try {
    const uuid = yield select(getUuidFromState);

    const data = yield call(rsf.database.read, `users/${uuid}/barber_shops`);

    const exists = data !== null && data !== undefined;

    if (exists) {
      const shopUid = data.shop_uid;

      const bookingsObj = yield call(
        rsf.database.read,
        `barber_shops/${shopUid}/bookings`
      );

      if (bookingsObj !== null && bookingsObj !== undefined) {
        const bookingsArr = Object.values(bookingsObj);

        const bookingsArrFormated = yield all(
          bookingsArr.map(function* (booking) {
            const clientInfo = yield call(
              rsf.database.read,
              `users/${booking.client_uid}`
            );

            delete clientInfo['bookings'];

            const bookingWithClient = {
              ...booking,
              ...clientInfo,
            };
            return bookingWithClient;
          })
        );

        yield put(putBarberBookings(bookingsArrFormated));
        yield put(putLoadingStatus(false));
      } else {
        yield put(putBarberBookings([]));
        yield put(putLoadingStatus(false));
      }
    } else {
      yield put(putBarberBookings([]));
      yield put(putLoadingStatus(false));
    }
  } catch (error) {
    yield put(putLoadingStatus(false));
    console.log(error);
    alert(`Error retrieving shop bookings! ${error}`);
  }
}

function* updateBookingStatusSaga({ payload }) {
  yield put(putLoadingStatus(true));

  const { shopUid, clientUid, bookingUid, status } = payload;

  try {
    yield call(
      rsf.database.update,
      `barber_shops/${shopUid}/bookings/${bookingUid}/status`,
      status
    );
    yield call(
      rsf.database.update,
      `users/${clientUid}/bookings/${bookingUid}/status`,
      status
    );

    yield call(getBarberBookingsSaga);
    yield put(putLoadingStatus(false));
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error updating booking status! ${error}`);
  }
}

export default function* Barber() {
  yield all([
    takeLatest(actions.GET.BARBER_SHOP, getBarberShopInfoSaga),
    takeLatest(actions.ADD.BARBER_SHOP, addBarberShopSaga),
    takeLatest(actions.EDIT.BARBER_SHOP, editBarberShopSaga),
    takeLatest(actions.GET.BARBER_BOOKINGS, getBarberBookingsSaga),
    takeLatest(actions.UPDATE_BOOKING_STATUS, updateBookingStatusSaga),
  ]);
}

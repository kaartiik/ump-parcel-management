/* eslint-disable no-console */
import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';
import { navigate } from '../services/NavigatorService';
import rsf, { auth, database } from '../../providers/config';
import {
  actions,
  putUserProfile,
  putUserName,
  putUserPhone,
  putLoadingStatus,
} from '../actions/User';

const loginRequest = ({ email, password }) =>
  auth.signInWithEmailAndPassword(email, password);

const anonLoginRequest = () => auth.signInAnonymously();

const logoutRequest = () => auth.signOut();

const onAuthStateChanged = () => {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        resolve(user);
      } else {
        resolve(null);
      }
    });
  });
};

const getUserProfile = (uid) =>
  database
    .ref('users')
    .child(uid)
    .once('value')
    .then((snapshot) => ({ dbUser: snapshot.val() }))
    .catch((error) => ({ error }));

function* syncUserSaga() {
  const user = yield call(onAuthStateChanged);

  console.log(user);

  if (user) {
    const { dbUser } = yield call(getUserProfile, user.uid);

    // merge auth and db user
    const authUser = {
      uid: user.uid,
      email: user.email,
      ...dbUser,
    };

    setTimeout(() => {
      navigate('AppStack');
    }, 100);

    yield put(putUserProfile(authUser));
  } else {
    alert('Non authorized user!');
    setTimeout(() => {
      navigate('AuthStack');
    }, 100);
  }
}

function* loginSaga({ email, password }) {
  try {
    yield call(loginRequest, { email, password });
  } catch (error) {
    alert(error);
    return;
  }
  yield call(syncUserSaga);
}

function* anonLoginSaga() {
  try {
    yield call(anonLoginRequest);
  } catch (error) {
    alert(error);
    return;
  }
  yield call(syncUserSaga);
}

function* logoutSaga() {
  try {
    yield call(logoutRequest);
  } catch (error) {
    alert('Error!');
    return;
  }
  yield call(syncUserSaga);
  //   AsyncStorage.removeItem(Constants.login.tokenKey, () =>
  //     navigate(Constants.routes.Auth),
  //   );
}

function* updateProfileSaga({ payload }) {
  const { uuid, name, phone, units } = payload;
  yield put(putLoadingStatus(true));

  try {
    if (!units.includes('NONE')) {
      yield all(
        units.map(function* (unit) {
          yield call(rsf.database.patch, `units/${unit}/users/${uuid}`, {
            name,
            phone,
          });
        })
      );
    }

    yield call(rsf.database.patch, `users/${uuid}`, {
      name,
      phone,
    });

    yield put(putUserName(name));
    yield put(putUserPhone(phone));

    yield put(putLoadingStatus(false));
  } catch (error) {
    yield put(putLoadingStatus(false));

    alert(`Error updating user details! ${error}`);
  }
}

export default function* User() {
  yield all([
    takeLatest(actions.LOGIN.REQUEST, loginSaga),
    takeLatest(actions.LOGIN.ANON_REQUEST, anonLoginSaga),
    takeLatest(actions.LOGOUT.REQUEST, logoutSaga),
    takeEvery(actions.SYNC_USER, syncUserSaga),
    takeLatest(actions.UPDATE.USER_PROFILE, updateProfileSaga),
    //   takeEvery(actions.PROFILE.UPDATE, updateProfileSaga),
  ]);
}

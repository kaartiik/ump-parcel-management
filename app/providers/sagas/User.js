/* eslint-disable no-console */
import { Platform } from 'react-native';
import {
  call,
  put,
  takeEvery,
  takeLatest,
  all,
  select,
  take,
  fork,
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import { navigate, reset, goBack } from '../services/NavigatorService';
import rsf, { auth, database } from '../../providers/config';
import {
  actions,
  putAllUsers,
  putAllScans,
  putUserProfile,
  putUserName,
  putUserMobile,
  putUserLocation,
  putLoadingStatus,
  putUserProfilePicture,
  putRecentlyScanned,
} from '../actions/User';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const getUuidFromState = (state) => state.userReducer.uuid;
const getNameFromState = (state) => state.userReducer.username;

const loginRequest = ({ email, password }) =>
  auth.signInWithEmailAndPassword(email, password);

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
  yield put(putLoadingStatus(true));
  const user = yield call(onAuthStateChanged);

  if (user) {
    const { dbUser } = yield call(getUserProfile, user.uid);

    if (dbUser !== null && dbUser !== undefined) {
      yield put(putUserProfile(dbUser));

      yield put(putLoadingStatus(false));

      setTimeout(() => {
        reset('AppStack');
      }, 100);
    }
  } else {
    yield put(putLoadingStatus(false));

    setTimeout(() => {
      reset('AuthStack');
    }, 100);
  }
}

function* loginSaga({ email, password }) {
  try {
    yield put(putLoadingStatus(true));
    yield call(loginRequest, { email, password });
    yield put(putLoadingStatus(false));

    yield call(syncUserSaga);
  } catch (error) {
    alert(error);
    return;
  }
}

function* forgotPasswordSaga({ payload }) {
  try {
    const { email } = payload;
    yield call(rsf.auth.sendPasswordResetEmail, email);
    alert('Password reset email has been sent your email.');
  } catch (error) {
    alert(error);
    return;
  }
}

function* uploadUserImage({ image, uuid }) {
  const id = new Date().getTime();
  const response = yield fetch(image.imageUri);
  const blob = yield response.blob();
  const filePath = `users/${uuid}/profile_picture/${id}_${image.imageName}`;

  const task = rsf.storage.uploadFile(filePath, blob);

  task.on('state_changed', (snapshot) => {
    const pct = (snapshot.bytesTransferred * 100) / snapshot.totalBytes;
  });

  // Wait for upload to complete
  yield task;

  const imageUrl = yield call(rsf.storage.getDownloadURL, filePath);

  return {
    image_name: `${id}_${image.imageName}`,
    image_url: imageUrl,
  };
}

function* registerSaga({ payload }) {
  yield put(putLoadingStatus(true));
  const { usertype, username, idnumber, email, password } = payload;
  try {
    const { user } = yield call(
      rsf.auth.createUserWithEmailAndPassword,
      email,
      password
    );

    yield call(rsf.database.update, `users/${user.uid}`, {
      usertype,
      username,
      idnumber,
      email,
      password,
      uuid: user.uid,
    });

    yield put(putLoadingStatus(false));

    yield call(syncUserSaga);
  } catch (error) {
    alert(`Failed to register ${error}`);
    return;
  }
}

function* logoutSaga() {
  try {
    yield call(logoutRequest);
  } catch (error) {
    alert('Error!');
    return;
  }
  yield call(syncUserSaga);
}

function* updateProfileSaga({ payload }) {
  const { username, mobile, location, profilePicture, onSuccess } = payload;

  const uuid = yield select(getUuidFromState);

  yield put(putLoadingStatus(true));

  try {
    const encodedStr = profilePicture.imageUri;
    const isHttps = encodedStr.indexOf('https');
    const isHttp = encodedStr.indexOf('http');

    if (isHttps === -1 || isHttp == -1) {
      const userImage = yield call(uploadUserImage, {
        image: profilePicture,
        uuid: uuid,
      });

      yield call(rsf.database.patch, `users/${uuid}`, {
        username,
        mobile,
        location,
        profile_picture: userImage,
      });

      const newProfilePic = yield call(
        rsf.database.read,
        `users/${uuid}/profile_picture`
      );

      yield put(putUserProfilePicture(newProfilePic));
    } else {
      yield call(rsf.database.patch, `users/${uuid}`, {
        username,
        mobile,
        location,
      });
    }

    yield put(putUserName(username));
    yield put(putUserMobile(mobile));
    yield put(putUserLocation(location));

    yield put(putLoadingStatus(false));

    onSuccess();
  } catch (error) {
    yield put(putLoadingStatus(false));

    alert(`Error updating user details! ${error}`);
  }
}

function* getAllUsersSaga() {
  try {
    yield put(putLoadingStatus(true));

    const data = yield call(rsf.database.read, `users`);

    const exists = data !== null && data !== undefined;

    if (exists) {
      const usersArr = Object.values(data);
      yield put(putAllUsers(usersArr));
    } else {
      yield put(putAllUsers([]));
    }

    yield put(putLoadingStatus(false));
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(error);
  }
}

function* getAllScannedParcelSaga({ payload }) {
  try {
    yield put(putLoadingStatus(true));

    const data = yield call(rsf.database.read, `all_scans`);

    const exists = data !== null && data !== undefined;

    if (exists) {
      const scansArr = Object.values(data);
      yield put(putAllScans(scansArr));
    } else {
      yield put(putAllScans([]));
    }

    yield put(putLoadingStatus(false));
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(error);
  }
}

function* getMyScannedParcelSaga({ payload }) {
  try {
    yield put(putLoadingStatus(true));

    const uuid = yield select(getUuidFromState);

    const data = yield call(rsf.database.read, `users/${uuid}/my_scans`);

    const exists = data !== null && data !== undefined;

    if (exists) {
      const scansArr = Object.values(data);
      yield put(putAllScans(scansArr));
    } else {
      yield put(putAllScans([]));
    }

    yield put(putLoadingStatus(false));
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(error);
  }
}

function* addScannedParcelSaga({ payload }) {
  const { username, usertype, idnumber, email, time, location, onSuccess } =
    payload;
  try {
    yield put(putLoadingStatus(true));
    const uuid = yield select(getUuidFromState);
    const uniqueid = Date.now();

    yield call(
      rsf.database.update,
      `users/${uuid}/my_scans/${uuid}_${uniqueid}`,
      {
        username,
        usertype,
        idnumber,
        email,
        time,
        location,
        scanID: `${uuid}_${uniqueid}`,
      }
    );

    yield call(rsf.database.update, `all_scans/${uuid}_${uniqueid}`, {
      username,
      usertype,
      idnumber,
      email,
      time,
      location,
      scanID: `${uuid}_${uniqueid}`,
    });

    yield put(putRecentlyScanned({ location, time }));

    onSuccess();

    yield put(putLoadingStatus(false));
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(error);
  }
}

export default function* User() {
  yield all([
    takeLatest(actions.REGISTER_REQUEST, registerSaga),
    takeLatest(actions.LOGIN.REQUEST, loginSaga),
    takeLatest(actions.LOGOUT.REQUEST, logoutSaga),
    takeLatest(actions.FORGOT_PASSWORD, forgotPasswordSaga),
    takeEvery(actions.SYNC_USER, syncUserSaga),
    takeLatest(actions.ADD.SCANNED_DETAILS, addScannedParcelSaga),
    takeLatest(actions.GET.ALL_USERS, getAllUsersSaga),
    takeLatest(actions.GET.MY_SCANS, getMyScannedParcelSaga),
    takeLatest(actions.GET.ALL_SCANS, getAllScannedParcelSaga),
    takeLatest(actions.UPDATE.USER_PROFILE, updateProfileSaga),
  ]);
}

/* eslint-disable no-console */
import {
  call,
  put,
  takeEvery,
  takeLatest,
  all,
  select,
  take,
} from 'redux-saga/effects';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import { navigate, reset } from '../services/NavigatorService';
import rsf, { auth, database } from '../../providers/config';
import {
  actions,
  putUserProfile,
  putToken,
  putLoadingStatus,
  putChats,
  putUserChats,
} from '../actions/User';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const getUuidFromState = (state) => state.userReducer.uuid;

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

function* getExpoToken() {
  try {
    console.log('## get expo token');
    const { status: existingStatus } = yield call(
      Permissions.getAsync,
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      console.log('## get expo token: not granted');
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = yield call(
        Permissions.askAsync,
        Permissions.NOTIFICATIONS
      );
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      console.log('## get expo token: still not granted');
      return { token: '' };
    }

    // Get the token that uniquely identifies this device
    console.log('## get expo token!!');

    const token = yield call(Notifications.getExpoPushTokenAsync);
    console.log(`Expo Push Token:${token}`);

    console.log(`Successfully uploaded expo token`);

    return {
      token,
    };
  } catch (error) {
    console.log(`Error uploading expo token: ${error}`);
    return { token: '' };
  }
}

function* syncUserSaga() {
  const user = yield call(onAuthStateChanged);

  if (user) {
    const { dbUser } = yield call(getUserProfile, user.uid);

    if (dbUser !== null && dbUser !== undefined) {
      yield put(putUserProfile(dbUser));

      setTimeout(() => {
        reset('AppStack');
      }, 100);
    }
  } else {
    setTimeout(() => {
      reset('AuthStack');
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

function* registerSaga({ payload }) {
  const { role, name, mobile, email, password } = payload;

  try {
    const { user } = yield call(
      rsf.auth.createUserWithEmailAndPassword,
      email,
      password
    );

    const { token: pushToken } = yield call(getExpoToken);

    yield call(rsf.database.update, `users/${user.uid}`, {
      role,
      name,
      mobile,
      email,
      password,
      uuid: user.uid,
      token: pushToken.data,
    });

    yield call(syncUserSaga);
  } catch (error) {
    alert(error);
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

function* sendMesssageSaga({ payload }) {
  const { receiverUuid, message } = payload;
  const senderUuid = yield select(getUuidFromState);

  const messageTime = dayjs().valueOf();

  const msgObject = {
    from: senderUuid,
    message: message,
    time: messageTime,
    to: receiverUuid,
  };
  console.log(msgObject);
  try {
    rsf.database.update(
      `chats/${senderUuid}/${receiverUuid}/${messageTime}`,
      msgObject
    );
    rsf.database.update(
      `chats/${receiverUuid}/${senderUuid}/${messageTime}`,
      msgObject
    );
  } catch (error) {
    alert(`Failed to send message. Please try again.`);
  }
}

function* syncChatsSaga() {
  const uuid = yield select(getUuidFromState);
  const channel = yield call(rsf.database.channel, `chats/${uuid}`);

  while (true) {
    const { value } = yield take(channel);

    if (value !== null && value !== undefined) {
      // const receiverKeys = Object.keys(value);
      const allChatsObject = Object.values(value);
      const receiverKeys = Object.keys(allChatsObject[0]);
      // const allMessagesObj = Object.values(allChatsObject);
      const allMessagesArr = Object.values(allChatsObject[0]);
      yield put(putChats(allChatsObject[0]));

      const newUserChats = yield all(
        receiverKeys.map(function* (key, idx) {
          const userDetails = yield call(rsf.database.read, `users/${key}`);
          const chatObject = allMessagesArr[idx];
          const chatMessagesArr = Object.values(chatObject);

          const chatUser = {
            uid: key,
            token: userDetails.token,
            name: userDetails.name,
            msg: chatMessagesArr[0].message,
            time: chatMessagesArr[0].time,
          };

          return chatUser;
        })
      );
      yield put(putUserChats(newUserChats));
    } else {
      yield put(putUserChats([]));
      return;
    }
  }
}

export default function* User() {
  yield all([
    takeLatest(actions.SYNC_CHATS, syncChatsSaga),
    takeLatest(actions.REGISTER_REQUEST, registerSaga),
    takeLatest(actions.REGISTER_REQUEST, registerSaga),
    takeLatest(actions.LOGIN.REQUEST, loginSaga),
    takeLatest(actions.LOGOUT.REQUEST, logoutSaga),
    takeEvery(actions.SYNC_USER, syncUserSaga),
    takeLatest(actions.UPDATE.USER_PROFILE, updateProfileSaga),
    takeLatest(actions.SEND_MESSAGE, sendMesssageSaga),
  ]);
}

/* eslint-disable no-console */
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
const getNameFromState = (state) => state.userReducer.name;

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
    const { token: pushToken } = yield call(getExpoToken);

    console.log(pushToken);

    const { dbUser } = yield call(getUserProfile, user.uid);

    if (dbUser !== null && dbUser !== undefined) {
      yield put(putUserProfile(dbUser));

      yield fork(startListener);

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

const sendPushNotification = async (receiverToken, senderName, senderMsg) => {
  const message = {
    to: receiverToken,
    sound: 'default',
    title: senderName,
    body: senderMsg,
    data: { data: 'goes here' },
    _displayInForeground: true,
  };
  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
};

function* sendMesssageSaga({ payload }) {
  const { receiverUuid, receiverToken, message } = payload;
  const senderUuid = yield select(getUuidFromState);
  const senderName = yield select(getNameFromState);

  const messageTime = dayjs().valueOf();

  const msgObject = {
    from: senderUuid,
    message: message,
    time: messageTime,
    to: receiverUuid,
  };

  try {
    yield call(
      rsf.database.update,
      `chats/${senderUuid}/${receiverUuid}/${messageTime}`,
      msgObject
    );
    yield call(
      rsf.database.update,
      `chats/${receiverUuid}/${senderUuid}/${messageTime}`,
      msgObject
    );

    sendPushNotification(receiverToken, senderName, message);
  } catch (error) {
    alert(`Failed to send message. Please try again. ${error}`);
  }
}

function* syncChatsSaga() {
  const uuid = yield select(getUuidFromState);
  const chats = yield call(rsf.database.read, `chats/${uuid}`);

  // const { value } = yield take(channel);

  if (chats !== null && chats !== undefined) {
    const receiverKeys = Object.keys(chats);
    yield put(putChats(chats));

    const newUserChats = yield all(
      receiverKeys.map(function* (key, idx) {
        const userDetails = yield call(rsf.database.read, `users/${key}`);
        const chatObject = chats[key];
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
  }
}

function* startListener() {
  // #1
  const uuid = yield select(getUuidFromState);
  const channel = new eventChannel((emiter) => {
    const listener = database.ref(`chats/${uuid}`).on('value', (snapshot) => {
      emiter({ data: snapshot.val() || {} });
    });

    // #2
    return () => {
      listener.off();
    };
  });

  // #3
  while (true) {
    const { data } = yield take(channel);
    // #4
    console.log('listener start');
    if (data !== null && data !== undefined) {
      const receiverKeys = Object.keys(data);
      yield put(putChats(data));

      const newUserChats = yield all(
        receiverKeys.map(function* (key, idx) {
          const userDetails = yield call(rsf.database.read, `users/${key}`);
          const chatObject = data[key];
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
    }
    // yield put(actionsCreators.updateList(data));
  }
}

function* getChatUserDetailsSaga({ payload }) {
  const userUuid = payload;

  try {
    const userDetails = yield call(rsf.database.read, `users/${userUuid}`);

    console.log(userDetails);

    yield call(navigate, 'Chats', {
      screen: 'ChatScreen',
      params: {
        nameClicked: userDetails.name,
        uidClicked: userDetails.uuid,
        tokenClicked: userDetails.token,
      },
    });
  } catch (error) {
    alert(`Failed to retrieve user.`);
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
    takeLatest(actions.GET.CHAT_USER_DETAILS, getChatUserDetailsSaga),
  ]);
}

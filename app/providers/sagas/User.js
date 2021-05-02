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
  putUserProfile,
  putUserName,
  putUserMobile,
  putUserLocation,
  putToken,
  putLoadingStatus,
  putChats,
  putUserChats,
  putUserProfilePicture,
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
    const { status: existingStatus } = yield call(
      Permissions.getAsync,
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
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
      return { token: '' };
    }

    // Get the token that uniquely identifies this device
    const token = yield call(Notifications.getExpoPushTokenAsync);

    return {
      token,
    };
  } catch (error) {
    alert(`Error uploading expo token: ${error}`);
    return { token: '' };
  }
}

function* syncUserSaga() {
  const user = yield call(onAuthStateChanged);

  if (user) {
    const { token: pushToken } = yield call(getExpoToken);

    yield call(rsf.database.update, `users/${user.uid}/token`, pushToken.data);

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
  const { location, username, mobile, email, password, userImage } = payload;

  try {
    const { user } = yield call(
      rsf.auth.createUserWithEmailAndPassword,
      email,
      password
    );

    const { token: pushToken } = yield call(getExpoToken);

    const profilePicture = yield call(uploadUserImage, {
      image: userImage,
      uuid: user.uid,
    });

    yield call(rsf.database.update, `users/${user.uid}`, {
      location,
      username,
      mobile,
      email,
      password,
      uuid: user.uid,
      token: pushToken.data,
      profile_picture: profilePicture,
    });

    // yield call(syncUserSaga);
  } catch (error) {
    alert(`didt register ${error}`);
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

    yield call(sendPushNotification, receiverToken, senderName, message);
  } catch (error) {
    alert(`Failed to send message. Please try again. ${error}`);
  }
}

function* sendProductSaga({ payload }) {
  const { receiverUuid, receiverToken, product } = payload;
  const senderUuid = yield select(getUuidFromState);
  const senderName = yield select(getNameFromState);

  const messageTime = dayjs().valueOf();

  const msgObject = {
    from: senderUuid,
    message: '',
    time: messageTime,
    to: receiverUuid,
    productDetails: {
      productName: product.productName,
      productPrice: product.price,
      productSellType: product.sellType,
      productPicture: Object.values(product.productImages)[0].imageUri,
    },
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

    yield call(sendPushNotification, receiverToken, senderName, 'Picture');
  } catch (error) {
    alert(`Failed to send message. Please try again. ${error}`);
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

    yield call(navigate, 'Chats', {
      screen: 'ChatScreen',
      params: {
        nameClicked: userDetails.name,
        uidClicked: userDetails.uuid,
        tokenClicked: userDetails.token,
      },
    });
  } catch (error) {
    alert(`Failed to retrieve user. ${error}`);
  }
}

export default function* User() {
  yield all([
    takeLatest(actions.REGISTER_REQUEST, registerSaga),
    takeLatest(actions.REGISTER_REQUEST, registerSaga),
    takeLatest(actions.LOGIN.REQUEST, loginSaga),
    takeLatest(actions.LOGOUT.REQUEST, logoutSaga),
    takeLatest(actions.FORGOT_PASSWORD, forgotPasswordSaga),
    takeEvery(actions.SYNC_USER, syncUserSaga),
    takeLatest(actions.UPDATE.USER_PROFILE, updateProfileSaga),
    takeLatest(actions.SEND_MESSAGE, sendMesssageSaga),
    takeLatest(actions.SEND_PRODUCT, sendProductSaga),
    takeLatest(actions.GET.CHAT_USER_DETAILS, getChatUserDetailsSaga),
  ]);
}

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
import { actions, putBarberShop, putLoadingStatus } from '../actions/Barber';
import { navigate, reset } from '../services/NavigatorService';

dayjs.extend(customParseFormat);

const getUuidFromState = (state) => state.userReducer.uuid;

const getUserNameFromState = (state) => state.userReducer.name;

const getUserAvatarFromState = (state) => state.userReducer.avatar;

const fetchNewShopKey = () => database.ref('barber_shops').push().key;

const getPostUserDetails = (uuid) =>
  database
    .ref('Users')
    .child(uuid)
    .once('value')
    .then((snapshot) => ({ userData: snapshot.val() || {} }));

const fetchRefreshedPosts = () =>
  database
    .ref('posts')
    .once('value')
    .then((snapshot) => ({ postsData: snapshot.val() || {} }));

const formatPost = ({ data, name, avatar }) => {
  const {
    user_uid,
    user_name,
    user_avatar,
    post_title,
    post_description,
    post_uid,
    updated_at,
    is_image,
    is_single_image,
    images,
  } = data;
  return {
    images,
    uid: user_uid,
    uName: name || 'Unavailable',
    uDp: avatar || '',
    pTitle: post_title,
    pDescr: post_description,
    pId: post_uid,
    pTime: dayjs(updated_at).format('DD MMMM YYYY'),
    pImage: is_image,
    pSingleImg: is_single_image,
  };
};

function* getBarberShopInfoSaga() {
  yield put(putLoadingStatus(true));
  try {
    const uuid = yield select(getUuidFromState);

    const data = yield call(rsf.database.read, `users/${uuid}/barber_shops`);

    const exists = data !== null && data !== undefined;
    if (exists) {
      yield put(putBarberShop(data));
      yield put(putLoadingStatus(false));
      console.log('shop exist');
      reset('Home');
    } else {
      console.log('shop doenst exist');
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
      shopOpenTime,
      shopCloseTime,
      onSuccess,
    } = payload;
    const uuid = yield select(getUuidFromState);

    const barberShopObj = {
      shop_name: shopName,
      shop_address: shopAddress,
      shop_contact: shopContact,
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

function* uploadPostWithImagesSaga({ payload }) {
  const { recipeType, title, description, ingredients, postImages } = payload;
  yield put(putLoadingStatus(true));

  const postKey = yield call(fetchNewPostKey);
  const images = {};

  try {
    yield all(
      postImages.map(function* (image) {
        const re = /(?:\.([^.]+))?$/;
        const ext = re.exec(image.imgUri)[1];
        const currentFileType = ext;
        const response = yield fetch(image.imgUri);
        const blob = yield response.blob();
        const fileName = image.imgId;
        const fileNameWithExt = `${fileName}.${currentFileType}`;
        const filePath = `Recipes/${postKey}/${fileNameWithExt}`;

        const task = rsf.storage.uploadFile(filePath, blob);

        task.on('state_changed', (snapshot) => {
          const pct = (snapshot.bytesTransferred * 100) / snapshot.totalBytes;
          console.log(`${pct}%`);
        });

        // Wait for upload to complete
        yield task;

        const imageUrl = yield call(rsf.storage.getDownloadURL, filePath);

        images[fileName] = {
          image_name: fileNameWithExt,
          image_url: imageUrl,
        };
      })
    );
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error uploading post images! ${error}`);
    return;
  }

  const postObject = {
    images,
    created_at: Date.now(),
    is_image: true,
    recipe_description: description,
    recipe_title: title,
    recipe_ingredients: ingredients,
    recipe_uid: postKey,
  };

  try {
    yield call(rsf.database.update, `recipes/${postKey}`, postObject);

    yield call(rsf.database.update, `${recipeType}/${postKey}`, postObject);
    yield put(putLoadingStatus(false));
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error uploading post! ${error}`);
  }
}

function* uploadEditedPostWithImagesSaga({ payload }) {
  const { title, description, postImages, removedPostImgs, postId } = payload;
  yield put(putLoadingStatus(true));

  const postKey = postId;
  const uuid = yield select(getUuidFromState);
  const uName = yield select(getUserNameFromState);
  const uAvatar = yield select(getUserAvatarFromState);
  const images = {};

  if (removedPostImgs.length > 0) {
    try {
      yield all(
        removedPostImgs.map(function* (image) {
          yield call(
            rsf.storage.deleteFile,
            `User/${uuid}/posts/${postKey}/${image.imgIdWithExt}`
          );

          yield call(
            rsf.database.delete,
            `posts/${postKey}/images/${image.imgId}`
          );
          yield call(
            rsf.database.delete,
            `users/${uuid}/posts/${postKey}/images/${image.imgId}`
          );
        })
      );
    } catch (error) {
      alert(`Error removing post images! ${error.message}`);
    }
  }

  try {
    yield all(
      postImages.map(function* (image) {
        if (!image.imgUri.includes('.com')) {
          const re = /(?:\.([^.]+))?$/;
          const ext = re.exec(image.imgUri)[1];
          const currentFileType = ext;
          const response = yield fetch(image.imgUri);
          const blob = yield response.blob();
          const fileName = image.imgId;
          const fileNameWithExt = `${fileName}.${currentFileType}`;
          const filePath = `User/${uuid}/posts/${postKey}/${fileNameWithExt}`;

          const task = rsf.storage.uploadFile(filePath, blob);

          task.on('state_changed', (snapshot) => {
            const pct = (snapshot.bytesTransferred * 100) / snapshot.totalBytes;
            console.log(`${pct}%`);
          });

          // Wait for upload to complete
          yield task;

          const imageUrl = yield call(rsf.storage.getDownloadURL, filePath);

          const addImage = {
            image_name: fileNameWithExt,
            image_url: imageUrl,
          };

          yield call(
            rsf.database.update,
            `posts/${postKey}/images/${fileName}`,
            addImage
          );

          yield call(
            rsf.database.update,
            `users/${uuid}/posts/${postKey}/images/${fileName}`,
            addImage
          );
        }
      })
    );
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error uploading updated post images! ${error}`);
    return;
  }

  const postObject = {
    is_image: true,
    is_single_image: !(postImages.length > 1),
    post_description: description,
    post_title: title,
    updated_at: Date.now(),
  };

  try {
    yield call(rsf.database.patch, `posts/${postKey}`, postObject);

    yield call(
      rsf.database.patch,
      `users/${uuid}/posts/${postKey}`,
      postObject
    );
    yield put(putLoadingStatus(false));
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error uploading updated post! ${error}`);
  }
}

function* deletePostSaga({ payload }) {
  const { uuid, postId, postImages } = payload;
  yield put(putLoadingStatus(true));
  if (postImages !== undefined) {
    const images = Object.values(postImages);
    try {
      yield all(
        images.map(function* (postImage) {
          yield call(
            rsf.storage.deleteFile,
            `User/${uuid}/posts/${postId}/${postImage.image_name}`
          );
        })
      );
      yield put(putLoadingStatus(false));
    } catch (error) {
      yield put(putLoadingStatus(false));
      alert(`Error deleting post image(s)! ${error}`);
      return;
    }
  }

  try {
    yield call(rsf.database.delete, `posts/${postId}`);
    yield call(rsf.database.delete, `users/${uuid}/posts/${postId}`);

    yield put(putLoadingStatus(false));
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error deleting post! ${error}`);
  }
}

function* deletePostImageSaga({ payload }) {
  const { uuid, postId, imageKey, imageKeyWithExt } = payload;
  yield put(putLoadingStatus(true));
  try {
    yield call(
      rsf.storage.deleteFile,
      `User/${uuid}/posts/${postId}/${imageKeyWithExt}`
    );
    yield call(rsf.database.delete, `posts/${postId}/images/${imageKey}`);
    yield call(
      rsf.database.delete,
      `users/${uuid}/posts/${postId}/images/${imageKey}`
    );

    yield put(putLoadingStatus(false));
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error deleting single post image! ${error}`);
  }
}

export default function* Barber() {
  yield all([
    takeLatest(actions.GET.BARBER_SHOP, getBarberShopInfoSaga),
    takeLatest(actions.ADD.BARBER_SHOP, addBarberShopSaga),
    takeLatest(actions.EDIT.BARBER_SHOP, editBarberShopSaga),
  ]);
}

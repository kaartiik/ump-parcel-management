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
  putAllProductsOri,
  putAllProducts,
  putMyProducts,
  putProductUserInfo,
  putCurrentProduct,
  putLoadingStatus,
} from '../actions/Product';
import { navigate, reset } from '../services/NavigatorService';

dayjs.extend(customParseFormat);

const getUuidFromState = (state) => state.userReducer.uuid;

const getOriProductsFromState = (state) => state.productReducer.allProductsOri;

const fetchNewProductKey = () => database.ref('products').push().key;

function* getAllProductsSaga() {
  yield put(putLoadingStatus(true));
  try {
    const data = yield call(rsf.database.read, `products`);

    const exists = data !== null && data !== undefined;

    if (exists) {
      const productsArr = Object.values(data);
      yield put(putAllProducts(productsArr));
      yield put(putAllProductsOri(productsArr));
      yield put(putLoadingStatus(false));
    } else {
      yield put(putAllProducts([]));
      yield put(putAllProductsOri([]));
      yield put(putLoadingStatus(false));
    }
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error retrieving products! ${error}`);
  }
}

function* getMyProductsSaga() {
  yield put(putLoadingStatus(true));
  try {
    const uuid = yield select(getUuidFromState);
    const myProductsObj = yield call(
      rsf.database.read,
      `users/${uuid}/products`
    );

    const exists = myProductsObj !== null && myProductsObj !== undefined;

    if (exists) {
      const myProductUuidsArr = Object.keys(myProductsObj);
      const myProducts = yield all(
        myProductUuidsArr.map(function* (productUuid) {
          const data = yield call(rsf.database.read, `products/${productUuid}`);
          return data;
        })
      );

      yield put(putMyProducts(myProducts));
      yield put(putLoadingStatus(false));
    } else {
      yield put(putMyProducts([]));
      yield put(putLoadingStatus(false));
    }
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error your retrieving products! ${error}`);
  }
}

function* getCategoryProductsSaga({ payload }) {
  yield put(putLoadingStatus(true));
  try {
    const category = payload;
    const oriListProducts = yield select(getOriProductsFromState);

    if (category === 'all') {
      yield put(putAllProducts(oriListProducts));
    } else {
      const categoryProducts = oriListProducts.filter(
        (item) => item.category === category
      );
      yield put(putAllProducts(categoryProducts));
    }
    yield put(putLoadingStatus(false));
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error retrieving products! ${error}`);
  }
}

function* uploadProductImages(images, productKey) {
  try {
    const finalImages = {};

    yield all(
      images.map(function* (image) {
        const id = new Date().getTime();
        const response = yield fetch(image.imageUri);
        const blob = yield response.blob();
        const filePath = `products/${productKey}/${id}_${image.imageName}`;

        const task = rsf.storage.uploadFile(filePath, blob);

        task.on('state_changed', (snapshot) => {
          const pct = (snapshot.bytesTransferred * 100) / snapshot.totalBytes;
        });

        // Wait for upload to complete
        yield task;

        const imageUrl = yield call(rsf.storage.getDownloadURL, filePath);

        finalImages[id] = {
          image_name: `${id}_${image.imageName}`,
          image_url: imageUrl,
        };
      })
    );

    return finalImages;
  } catch (error) {
    alert('Failed to upload images.');
  }
}

function* addProductSaga({ payload }) {
  yield put(putLoadingStatus(true));
  try {
    const {
      productName,
      category,
      description,
      price,
      sellType,
      productImages,
      meetUpLocation,
    } = payload;
    const uuid = yield select(getUuidFromState);
    const productKey = yield select(fetchNewProductKey);

    const uploadedImages = yield call(
      uploadProductImages,
      productImages,
      productKey
    );

    const productObj = {
      productUid: productKey,
      productName: productName,
      category: category,
      description: description,
      price: price,
      sellType: sellType,
      productImages: uploadedImages,
      meetUpLocation: meetUpLocation,
      owner_uuid: uuid,
    };

    yield call(rsf.database.update, `products/${productKey}`, productObj);
    yield call(rsf.database.update, `users/${uuid}/products/${productKey}`, {
      productUid: productKey,
    });

    yield put(putLoadingStatus(false));
    alert('Product added.');
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error adding product. ${error}`);
  }
}

function* updateProductSaga({ payload }) {
  yield put(putLoadingStatus(true));
  try {
    const {
      productUid,
      productName,
      category,
      description,
      price,
      sellType,
      productImages,
      meetUpLocation,
      onSuccess,
    } = payload;
    const uuid = yield select(getUuidFromState);

    const prevImages = {};

    const removedUploadedImages = yield all(
      productImages.filter((img) => img.imageUri.indexOf('https') === -1)
    );

    const previousUploadedImages = yield all(
      productImages.filter((img) => img.imageUri.indexOf('https') !== -1)
    );

    const unNeededData = yield all(
      previousUploadedImages.map(function* (img) {
        const imageName = img.imageName;
        const imageId = imageName.substr(0, imageName.indexOf('_'));

        prevImages[imageId] = {
          image_name: img.imageName,
          image_url: img.imageUri,
        };

        return imageName;
      })
    );

    const newUploadedImages = yield call(
      uploadProductImages,
      removedUploadedImages,
      productUid
    );

    const combinedPrevUploadAndNewUploadImages = {
      ...prevImages,
      ...newUploadedImages,
    };

    const productObj = {
      productUid: productUid,
      productName: productName,
      category: category,
      description: description,
      price: price,
      sellType: sellType,
      productImages: combinedPrevUploadAndNewUploadImages,
      meetUpLocation: meetUpLocation,
      owner_uuid: uuid,
    };

    yield call(rsf.database.update, `products/${productUid}`, productObj);
    yield call(rsf.database.update, `users/${uuid}/products/${productUid}`, {
      productUid: productUid,
    });

    const images = Object.values(combinedPrevUploadAndNewUploadImages);

    const modifiedImages = images.map((img) => ({
      imageUri: img.image_url,
      imageName: img.image_name,
    }));

    const modifiedProduct = {
      ...productObj,
      productImages: modifiedImages,
    };

    yield put(putCurrentProduct(modifiedProduct));

    yield put(putLoadingStatus(false));

    onSuccess();
  } catch (error) {
    yield put(putLoadingStatus(false));
    alert(`Error adding product. ${error}`);
  }
}

function* getProductUserInfoSaga({ payload }) {
  try {
    const product = payload;
    yield put(putLoadingStatus(true));

    const ownerObj = yield call(
      rsf.database.read,
      `users/${product.owner_uuid}`
    );

    const productUserInfoObj = {
      sellerName: ownerObj.username,
      sellerPicture: ownerObj.profile_picture.image_url,
      sellerUuid: ownerObj.uuid,
      sellerToken: ownerObj.token,
      sellerLocation: ownerObj.location,
    };

    yield put(putProductUserInfo(productUserInfoObj));

    const images = Object.values(product.productImages);

    const modifiedImages = images.map((img) => ({
      imageUri: img.image_url,
      imageName: img.image_name,
    }));

    const modifiedProduct = {
      ...product,
      productImages: modifiedImages,
    };

    yield put(putCurrentProduct(modifiedProduct));

    navigate('ProductStack', { screen: 'ViewProduct' });

    yield put(putLoadingStatus(false));
  } catch (error) {
    alert(`Failed to retrieve user info for the product. ${error}`);
  }
}

function* deletePerImageSaga({ payload }) {
  try {
    const { image, productUid } = payload;
    const imageName = image.imageName;
    const imageKey = imageName.substr(0, imageName.indexOf('_'));

    yield put(putLoadingStatus(true));

    yield call(
      rsf.database.delete,
      `products/${productUid}/productImages/${imageKey}`
    );

    yield call(rsf.storage.deleteFile, `products/${productUid}/${imageName}`);

    yield put(putLoadingStatus(false));
  } catch (error) {
    alert(`Failed to delete product image. ${error}`);
  }
}

function* deleteProductSaga({ payload }) {
  try {
    yield put(putLoadingStatus(true));
    const uuid = yield select(getUuidFromState);
    const { productUid, onSuccess } = payload;

    yield call(rsf.database.delete, `products/${productUid}`);
    yield call(rsf.database.delete, `users/${uuid}/products/${productUid}`);

    yield call(getAllProductsSaga);
    yield call(getMyProductsSaga);

    onSuccess();

    yield put(putLoadingStatus(false));
  } catch (error) {
    alert(`Failed to delete prduct. ${error}`);
  }
}

export default function* Product() {
  yield all([
    takeLatest(actions.GET.ALL_PRODUCTS, getAllProductsSaga),
    takeLatest(actions.GET.MY_PRODUCTS, getMyProductsSaga),
    takeLatest(actions.GET.CATEGORY_PRODUCTS, getCategoryProductsSaga),
    takeLatest(actions.ADD.PRODUCT, addProductSaga),
    takeLatest(actions.DELETE.PRODUCT, deleteProductSaga),
    takeLatest(actions.GET.PRODUCT_USER_INFO, getProductUserInfoSaga),
    takeLatest(actions.DELETE.PER_IMAGE, deletePerImageSaga),
    takeLatest(actions.UPDATE.PRODUCT, updateProductSaga),
  ]);
}

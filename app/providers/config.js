import * as firebase from 'firebase';
import {
  FIREBASE_API_KEY,
  FIREBASE_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID,
} from '@env';
import ReduxSagaFirebase from 'redux-saga-firebase';

const config = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
};

// Initialize Firebase
if (!firebase.apps.length) {
  alert(config);
  firebase.initializeApp(config);
}

export const f = firebase;
export const f2 = firebase.initializeApp(config, 'other');
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();

const rsf = new ReduxSagaFirebase(firebase);
export const rsf2 = new ReduxSagaFirebase(f2);
export default rsf;

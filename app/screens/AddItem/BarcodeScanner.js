/* eslint-disable global-require */
import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
} from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import PropTypes from 'prop-types';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import LoadingIndicator from '../../components/LoadingIndicator';
import colours from '../../providers/constants/colours';

import { addScannedDetails } from '../../providers/actions/User';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const SCREEN_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  navContainer: {
    flex: 1,
    backgroundColor: colours.themePrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconTitle: { fontFamily: 'sans-serif-light', fontSize: 18, color: 'white' },
  previewBGImg: {
    opacity: 0.5,
    height: 350,
    width: SCREEN_WIDTH / 2,
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewBGImgFull: {
    opacity: 0.5,
    height: 350,
    width: '100%',
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipePreviewText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    flexWrap: 'wrap',
    margin: 5,
  },
});

function BarCodeScannerScreen({ navigation, route }) {
  const onScan = route.params;
  const dispatch = useDispatch();
  const [location, setLocation] = useState('');
  const [scanned, setScanned] = useState(false);

  const { username, email, usertype, idnumber, isLoading } = useSelector(
    (state) => ({
      username: state.userReducer.username,
      email: state.userReducer.email,
      usertype: state.userReducer.usertype,
      idnumber: state.userReducer.idnumber,
      isLoading: state.userReducer.isLoading,
    })
  );

  useEffect(() => {
    getLocationAsync();
  }, []);

  const getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      alert('Permission to access location was denied');
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    const { latitude, longitude } = location.coords;
    getGeocodeAsync({ latitude, longitude });
  };

  const getGeocodeAsync = async (location) => {
    let geocode = await Location.reverseGeocodeAsync(location);
    alert(
      `${geocode[0].street}, ${geocode[0].city}, ${geocode[0].district}, ${geocode[0].region}`
    );
    setLocation(
      `${geocode[0].street}, ${geocode[0].city}, ${geocode[0].district}, ${geocode[0].region}`
    );
  };

  const handleBarCodeScanned = ({ type, data }) => {
    if (data.indexOf('ParcelID') !== 0) {
      alert('Invalid QR Code. Scan a valid checkpoint QR Code.');
      return;
    }
    if (location === '') {
      alert('Fetching location. Please try again.');
      return;
    }
    dispatch(
      addScannedDetails(
        username,
        usertype,
        idnumber,
        email,
        dayjs().format('DD-MM-YYYY hh:mm A'),
        location,
        () => navigation.navigate('ScannedDetails')
      )
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
    </KeyboardAvoidingView>
  );
}

export default BarCodeScannerScreen;

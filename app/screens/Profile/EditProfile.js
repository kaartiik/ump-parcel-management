import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Picker } from 'native-base';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AppBar from '../../components/AppBar';
import LoadingIndicator from '../../components/LoadingIndicator';
import { updateUserProfile } from '../../providers/actions/User';

import colours from '../../providers/constants/colours';

import {
  getBarberBookings,
  updateBookingStatus,
} from '../../providers/actions/Product';

const styles = StyleSheet.create({
  divider: {
    marginHorizontal: 16,
    height: 0.5,
    width: '100%',
    backgroundColor: colours.borderGrey,
    alignSelf: 'center',
  },
  bigBtn: {
    marginTop: 30,
    marginBottom: 10,
    marginHorizontal: 20,
    backgroundColor: colours.themePrimary,
    borderRadius: 4,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeDescription: {
    marginVertical: 3,
    width: 220,
  },
  bookingItem: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 6,
  },
  textboxContainer: {
    backgroundColor: colours.themePrimaryLight,
    borderRadius: 3,
    padding: 5,
    marginVertical: 5,
  },
  previewImg: {
    height: 100,
    width: 100,
    resizeMode: 'cover',
    alignSelf: 'flex-start',
    borderRadius: 6,
  },
  flatlistEmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    marginTop: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colours.themePrimaryLight,
    borderRadius: 3,
    padding: 5,
  },
});

const IMAGE_DIMENSION = 100;

const validationSchema = yup.object().shape({
  username: yup.string().required('Required'),
  mobile: yup.string().required('Required'),
  location: yup.string().required('Required'),
});

function EditProfile({ route, navigation }) {
  const dispatch = useDispatch();
  const [userImage, setUserImage] = useState(null);

  const {
    username,
    email,
    mobile,
    profilePicture,
    location,
    isLoading,
  } = useSelector((state) => ({
    username: state.userReducer.username,
    mobile: state.userReducer.mobile,
    location: state.userReducer.location,
    profilePicture: state.userReducer.profilePicture,
    isLoading: state.userReducer.isLoading,
  }));

  useEffect(() => {
    setUserImage(profilePicture);
  }, [profilePicture]);

  const findNewImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setUserImage({
        imageUri: result.uri,
        imageName: result.uri.substring(result.uri.lastIndexOf('/') + 1),
      });
    }
  };

  const getLocationAsync = async (setFieldValue, field) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      alert('Permission to access location was denied');
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    const { latitude, longitude } = location.coords;
    getGeocodeAsync({ latitude, longitude }, setFieldValue, field);
  };

  const getGeocodeAsync = async (location, setFieldValue, field) => {
    let geocode = await Location.reverseGeocodeAsync(location);
    setFieldValue(
      field,
      `${geocode[0].street}, ${geocode[0].city}, ${geocode[0].district}, ${geocode[0].region}`
    );
  };

  const handleSave = (values) => {
    const { username, mobile, location } = values;

    dispatch(
      updateUserProfile(username, mobile, location, userImage, () =>
        navigation.goBack()
      )
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <AppBar />

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 18 }}>Edit Profile</Text>

        <View style={styles.divider} />
      </View>

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <ScrollView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Formik
              initialValues={{
                location: location,
                username: username,
                mobile: mobile,
              }}
              onSubmit={(values) => handleSave(values)}
              validationSchema={validationSchema}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                touched,
                values,
                submitCount,
                errors,
              }) => {
                return (
                  <View style={{ padding: 10 }}>
                    <View style={{ alignItems: 'center', marginBottom: 20 }}>
                      {userImage === null || userImage === undefined ? (
                        <Image
                          source={require('../../../assets/default_avatar.jpg')}
                          style={{
                            height: IMAGE_DIMENSION,
                            width: IMAGE_DIMENSION,
                            borderRadius: IMAGE_DIMENSION / 2,
                          }}
                        />
                      ) : (
                        <Image
                          source={{ uri: userImage.imageUri }}
                          style={{
                            height: IMAGE_DIMENSION,
                            width: IMAGE_DIMENSION,
                            borderRadius: IMAGE_DIMENSION / 2,
                          }}
                        />
                      )}

                      <TouchableOpacity onPress={() => findNewImage()}>
                        <Text>Edit Image</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.textboxContainer}>
                      <TextInput
                        placeholder="Enter username..."
                        value={values.username}
                        onChangeText={handleChange('username')}
                        onBlur={handleBlur('username')}
                      />
                    </View>
                    <Text style={{ color: 'red' }}>
                      {(touched.username || submitCount > 0) && errors.username}
                    </Text>

                    <View style={styles.textboxContainer}>
                      <TextInput
                        placeholder="Enter mobile number..."
                        value={values.mobile}
                        onChangeText={handleChange('mobile')}
                        onBlur={handleBlur('mobile')}
                      />
                    </View>
                    <Text style={{ color: 'red' }}>
                      {(touched.mobile || submitCount > 0) && errors.mobile}
                    </Text>

                    <View style={styles.textboxContainer}>
                      <TextInput
                        placeholder="Enter location..."
                        value={values.location}
                        onChangeText={handleChange('location')}
                        onBlur={handleBlur('location')}
                      />
                    </View>
                    <Text style={{ color: 'red' }}>
                      {(touched.location || submitCount > 0) && errors.location}
                    </Text>

                    <TouchableOpacity
                      style={styles.bigBtn}
                      onPress={() =>
                        getLocationAsync(setFieldValue, 'location')
                      }
                    >
                      <Text style={{ color: 'white' }}>Detect Location</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.bigBtn}
                      onPress={handleSubmit}
                    >
                      <Text style={{ color: 'white' }}>Save</Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            </Formik>
          </TouchableWithoutFeedback>
        </ScrollView>
      )}
    </View>
  );
}

export default EditProfile;

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Picker } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AppBar from '../../components/AppBar';
import LoadingIndicator from '../../components/LoadingIndicator';

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

const GeneralInfo = ({ title, info }) => (
  <View style={{ flexDirection: 'row', marginLeft: 10, marginVertical: 5 }}>
    <Text style={{ fontSize: 16, marginRight: 8 }}>{title}: </Text>
    <Text>{info}</Text>
  </View>
);

function Profile({ route, navigation }) {
  const dispatch = useDispatch();

  const {
    username,
    email,
    mobile,
    profilePicture,
    location,
    isLoading,
  } = useSelector((state) => ({
    username: state.userReducer.username,
    email: state.userReducer.email,
    mobile: state.userReducer.mobile,
    location: state.userReducer.location,
    profilePicture: state.userReducer.profilePicture,
    isLoading: state.userReducer.isLoading,
  }));

  return (
    <View style={{ flex: 1 }}>
      <AppBar />

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 18 }}>Profile</Text>

        <View style={styles.divider} />
      </View>

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <ScrollView
          contentContainerStyle={{
            justifyContent: 'center',
            padding: 10,
          }}
        >
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            {profilePicture === null || profilePicture === undefined ? (
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
                source={{ uri: profilePicture.imageUri }}
                style={{
                  height: IMAGE_DIMENSION,
                  width: IMAGE_DIMENSION,
                  borderRadius: IMAGE_DIMENSION / 2,
                }}
              />
            )}
          </View>

          <GeneralInfo title="Username" info={username} />
          <GeneralInfo title="Mobile" info={mobile} />
          <GeneralInfo title="Location" info={location} />

          <TouchableOpacity
            style={styles.bigBtn}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={{ color: 'white' }}>Edit</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

export default Profile;

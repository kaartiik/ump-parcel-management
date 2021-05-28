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
    <Text style={{ flex: 1 }}>{info}</Text>
  </View>
);

function Home({ route, navigation }) {
  const dispatch = useDispatch();

  const { username, email, usertype, idnumber, isLoading } = useSelector(
    (state) => ({
      username: state.userReducer.username,
      email: state.userReducer.email,
      usertype: state.userReducer.usertype,
      idnumber: state.userReducer.idnumber,
      isLoading: state.userReducer.isLoading,
    })
  );

  return (
    <View style={{ flex: 1 }}>
      <AppBar />

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Profile</Text>

        <View style={styles.divider} />
      </View>

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <ScrollView>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
            }}
          >
            <GeneralInfo title="Name" info={username} />
            <GeneralInfo title="User Type" info={usertype} />
            <GeneralInfo title="ID Number" info={idnumber} />
            <GeneralInfo title="Email" info={email} />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

export default Home;

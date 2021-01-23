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
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import AppBar from '../../components/AppBar';
import LoadingIndicator from '../../components/LoadingIndicator';

import colours from '../../providers/constants/colours';
import timeList from '../../providers/constants/timeList';

import { getBookings } from '../../providers/actions/Client';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const styles = StyleSheet.create({
  divider: {
    marginHorizontal: 16,
    height: 0.5,
    width: '100%',
    backgroundColor: colours.borderGrey,
    alignSelf: 'center',
  },
  recipeDescription: {
    marginVertical: 3,
    width: 220,
  },
  bookingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
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

const RenderItem = ({ item }) => {
  return (
    <View style={{ marginTop: 10, padding: 10 }}>
      <View style={styles.bookingItem}>
        <View style={{ marginLeft: 10 }}>
          <Text
            style={{
              fontSize: 15,
              color: colours.lightBlue,
              marginVertical: 3,
            }}
          >
            {item.service}
          </Text>
        </View>
      </View>
    </View>
  );
};

RenderItem.propTypes = {
  item: PropTypes.string.isRequired,
};

function Home({ route, navigation }) {
  const dispatch = useDispatch();

  const { isAdmin, myBookings, isLoading } = useSelector((state) => ({
    isAdmin: state.userReducer.isAdmin,
    myBookings: state.clientReducer.myBookings,
    isLoading: state.clientReducer.isLoading,
  }));

  useEffect(() => {
    dispatch(getBookings());
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <AppBar />

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 18 }}>My Bookings</Text>

        <View style={styles.divider} />
      </View>

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={myBookings}
          renderItem={({ item, index }) => (
            <RenderItem key={index} item={item} />
          )}
          ListEmptyComponent={
            <View style={styles.flatlistEmptyContainer}>
              <Text>No bookings</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

export default Home;

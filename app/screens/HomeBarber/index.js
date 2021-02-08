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
} from '../../providers/actions/Barber';
import timeList from '../../providers/constants/timeList';

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

const RenderItem = ({ item }) => {
  const dispatch = useDispatch();

  return (
    <View style={{ marginTop: 10, padding: 10 }}>
      <View style={styles.bookingItem}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <Text style={{ fontWeight: 'bold' }}>
            {dayjs(item.booking_time).format('DD-MM-YYYY hh:mm A')}
          </Text>
          <Text
            style={{
              fontWeight: 'bold',
              color: item.status === 'Pending' ? 'red' : 'green',
            }}
          >
            {item.status}
          </Text>
        </View>
        <Text style={{ fontWeight: 'bold' }}>{item.service}</Text>
        <Text>{item.name}</Text>
        <Text>{item.mobile}</Text>

        <Picker
          style={{ width: '95%', alignSelf: 'center' }}
          selectedValue={item.status}
          onValueChange={(value) =>
            dispatch(
              updateBookingStatus(
                item.shop_uid,
                item.client_uid,
                item.booking_uid,
                item.booking_time,
                value
              )
            )
          }
        >
          <Picker.Item label="Confirmed" value="Confirmed" />
          <Picker.Item label="Pending" value="Pending" />
        </Picker>
      </View>
    </View>
  );
};

RenderItem.propTypes = {
  item: PropTypes.object.isRequired,
};

function Home({ route, navigation }) {
  const dispatch = useDispatch();

  const { isAdmin, barberBookings, isLoading } = useSelector((state) => ({
    isAdmin: state.userReducer.isAdmin,
    barberBookings: state.barberReducer.barberBookings,
    isLoading: state.clientReducer.isLoading,
  }));

  useFocusEffect(
    useCallback(() => {
      dispatch(getBarberBookings());
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      <AppBar />

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 18 }}>Bookings</Text>

        <View style={styles.divider} />
      </View>

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={barberBookings}
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

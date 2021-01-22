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

import { getBarberShops } from '../../providers/actions/Client';

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
  recipeItem: {
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

const RenderItem = ({ item, day, shopItem, navigation }) => {
  const fullDate = `${day.dateString} ${item}`;
  return (
    <View style={{ marginTop: 10, padding: 10 }}>
      <TouchableOpacity
        style={styles.recipeItem}
        onPress={() =>
          navigation.navigate('ConfirmBooking', {
            shopItem,
            timestamp: dayjs(
              `${day.dateString} ${item}`,
              'YYYY-MM-DD hh:mm A'
            ).valueOf(),
          })
        }
      >
        <View style={{ marginLeft: 10 }}>
          <Text
            style={{
              fontSize: 15,
              color: colours.lightBlue,
              marginVertical: 3,
            }}
          >
            {item}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

RenderItem.propTypes = {
  item: PropTypes.string.isRequired,
};

function TimeSlots({ route, navigation }) {
  const { shopItem, day } = route.params;
  const { isAdmin, isLoading } = useSelector((state) => ({
    isAdmin: state.userReducer.isAdmin,
    isLoading: state.clientReducer.isLoading,
  }));

  return (
    <View style={{ flex: 1 }}>
      <AppBar />

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 18 }}>Barber Shops</Text>

        <View style={styles.divider} />
      </View>

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={timeList}
          renderItem={({ item, index }) => (
            <RenderItem
              key={index}
              item={item}
              day={day}
              shopItem={shopItem}
              navigation={navigation}
            />
          )}
          ListEmptyComponent={
            <View style={styles.flatlistEmptyContainer}>
              <Text>No time slots</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

export default TimeSlots;

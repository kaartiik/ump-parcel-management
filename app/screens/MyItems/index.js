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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import colours from '../../providers/constants/colours';
import { getAllScans, getMyScans } from '../../providers/actions/User';

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
  individualText: { color: 'black', fontWeight: 'bold', marginVertical: 5 },
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
    <View
      style={{
        backgroundColor: colours.themePrimaryLight,
        width: '100%',
        borderRadius: 6,
        paddingHorizontal: 5,
        margin: 8,
      }}
    >
      <Text style={styles.individualText}>Name: {item.username}</Text>
      <Text style={styles.individualText}>ID Number: {item.idnumber}</Text>
      <Text style={styles.individualText}>User Type: {item.usertype}</Text>
      <Text style={styles.individualText}>Email: {item.email}</Text>
      <Text style={styles.individualText}>Location: {item.location}</Text>
      <Text style={styles.individualText}>Time: {item.time}</Text>
    </View>
  );
};

RenderItem.propTypes = {
  item: PropTypes.object.isRequired,
};

function MyItems({ route, navigation }) {
  const dispatch = useDispatch();

  const { usertype, scans, isLoading } = useSelector((state) => ({
    usertype: state.userReducer.usertype,
    scans: state.userReducer.scans,
    isLoading: state.userReducer.isLoading,
  }));

  useFocusEffect(
    useCallback(() => {
      if (usertype === 'Admin') {
        dispatch(getAllScans());
      } else {
        dispatch(getMyScans());
      }
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      <AppBar />

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>My Collections</Text>

        <View style={styles.divider} />
      </View>

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={scans}
          numColumns={2}
          renderItem={({ item, index }) => (
            <RenderItem key={index} item={item} />
          )}
          ListEmptyComponent={
            <View style={styles.flatlistEmptyContainer}>
              <Text>No scans</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

export default MyItems;

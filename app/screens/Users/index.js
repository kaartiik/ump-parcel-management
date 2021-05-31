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
import { getAllUsers } from '../../providers/actions/User';

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
  individualText: { color: 'black', fontWeight: 'bold', marginVertical: 5 },
});

const RenderItem = ({ item }) => {
  return (
    <View
      style={{
        backgroundColor: colours.themePrimaryLight,
        width: '95%',
        borderRadius: 6,
        paddingHorizontal: 5,
        margin: 8,
      }}
    >
      <Text style={styles.individualText}>Name: {item.username}</Text>
      <Text style={styles.individualText}>ID Number: {item.idnumber}</Text>
      <Text style={styles.individualText}>User Type: {item.usertype}</Text>
      <Text style={styles.individualText}>Email: {item.email}</Text>
    </View>
  );
};

RenderItem.propTypes = {
  item: PropTypes.object.isRequired,
};

function Users({ route, navigation }) {
  const dispatch = useDispatch();

  const { users, isLoading } = useSelector((state) => ({
    users: state.userReducer.users,
    isLoading: state.userReducer.isLoading,
  }));

  useFocusEffect(
    useCallback(() => {
      dispatch(getAllUsers());
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      <AppBar />

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 18 }}>Users</Text>

        <View style={styles.divider} />
      </View>

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={users}
          numColumns={2}
          renderItem={({ item, index }) => (
            <RenderItem key={index} item={item} />
          )}
          ListEmptyComponent={
            <View style={styles.flatlistEmptyContainer}>
              <Text>No users</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

export default Users;

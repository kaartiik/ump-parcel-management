import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import LoadingIndicator from '../../components/LoadingIndicator';
import AppBar from '../../components/AppBar';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const styles = StyleSheet.create({
  perChatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  perChatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    marginHorizontal: 10,
    marginLeft: 15,
  },
  perChatUser: {
    alignSelf: 'flex-start',
    fontSize: 20,
  },
});

export default function Chats({ route, navigation }) {
  const { userChats, isLoading } = useSelector((state) => ({
    userChats: state.userReducer.userChats,
    isLoading: state.userReducer.isLoading,
  }));

  console.log(userChats);

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ChatScreen', {
            nameClicked: item.name,
            uidClicked: item.uid,
            tokenClicked: item.token,
          }); //latest added
        }}
        style={{ padding: 10, borderBottomColor: '#ccc', borderBottomWidth: 1 }}
      >
        <View style={styles.perChatContainer}>
          <Image
            source={require('../../../assets/avatar.png')}
            style={styles.perChatAvatar}
          />
          <View>
            <Text style={styles.perChatUser}>{item.name}</Text>
            <View style={{ width: '85%' }}>
              <Text numberOfLines={1} ellipsizeMode="tail">
                {item.msg}
              </Text>
              <Text style={{ alignSelf: 'flex-end' }}>
                {dayjs(item.time).format('hh:mm A DD-MM-YYYY')}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppBar />

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <FlatList
          data={userChats}
          renderItem={renderRow}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text>No chats</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

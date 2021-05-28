import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { Header, Left, Right, Body } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import colours from '../providers/constants/colours';
import { logout } from '../providers/actions/User';

const AppBar = () => {
  const dispatch = useDispatch();

  const { isAdmin } = useSelector((state) => ({
    isAdmin: state.userReducer.isAdmin,
  }));

  return (
    <View>
      <Header
        style={{
          backgroundColor: colours.themePrimary,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 8,
        }}
      >
        <Left>
          <TouchableOpacity onPress={() => dispatch(logout())}>
            <Ionicons name="ios-exit" size={20} color="white" />
          </TouchableOpacity>
        </Left>

        <Body>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
            }}
          >
            UMP Parcel Management
          </Text>
        </Body>

        <Right />
      </Header>
    </View>
  );
};

export default AppBar;

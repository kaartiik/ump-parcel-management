import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
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
          <Image
            // eslint-disable-next-line global-require
            source={require('../../assets/barbershop.png')}
            resizeMode="contain"
            style={{ alignSelf: 'flex-start', height: '100%', width: '150%' }}
          />
        </Body>

        <Right />
      </Header>
    </View>
  );
};

export default AppBar;

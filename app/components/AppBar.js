import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Header, Left, Right, Body } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import colours from '../providers/constants/colours';

const AppBar = () => {
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
          <Image
            // eslint-disable-next-line global-require
            source={require('../../assets/ResipiIbu.png')}
            resizeMode="contain"
            style={{ alignSelf: 'flex-start', height: '100%', width: '150%' }}
          />
        </Left>

        <Right>
          <TouchableOpacity>
            <Ionicons name="ios-search" size={18} color="white" />
          </TouchableOpacity>
        </Right>
      </Header>
    </View>
  );
};

export default AppBar;

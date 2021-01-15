/* eslint-disable global-require */
import React, { useState, useEffect } from 'react';
import {
  Alert,
  TouchableOpacity,
  Text,
  View,
  FlatList,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardItem } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import AppBar from '../../components/AppBar';
import LoadingIndicator from '../../components/LoadingIndicator';
import colours from '../../providers/constants/colours';

const styles = StyleSheet.create({
  navContainer: {
    flex: 1,
    backgroundColor: colours.themePrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconTitle: { fontFamily: 'sans-serif-light', fontSize: 18, color: 'white' },
});

const NavIcons = () => (
  <View style={styles.navContainer}>
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity style={{ marginRight: 20, alignItems: 'center' }}>
        <Image
          source={require('../../../assets/breakfast.png')}
          style={{ height: 80, width: 80 }}
        />
        <Text style={styles.iconTitle}>Breakfast</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ marginLeft: 20, alignItems: 'center' }}>
        <Image
          source={require('../../../assets/lunch.png')}
          style={{ height: 80, width: 80 }}
        />
        <Text style={styles.iconTitle}>Lunch</Text>
      </TouchableOpacity>
    </View>

    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity style={{ alignItems: 'center' }}>
        <Image
          source={require('../../../assets/dinner.png')}
          style={{ height: 80, width: 80 }}
        />
        <Text style={styles.iconTitle}>Dinner</Text>
      </TouchableOpacity>
    </View>
  </View>
);

function Home() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <AppBar />
      <ScrollView keyboardDismissMode="on-drag">
        <NavIcons />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default Home;

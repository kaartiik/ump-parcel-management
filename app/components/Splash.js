import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';

import Logo from './Logo';

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  debugLog: {
    position: 'absolute',
    bottom: 16,
    width: '100%',
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#CCCCCC',
  },
});

const Splash = () => {
  const { debugLog } = useSelector((state) => ({
    debugLog: state.userReducer.debugSplashLog,
  }));

  return (
    <View style={style.container}>
      <Logo />
      <Text style={style.debugLog}>{debugLog}</Text>
    </View>
  );
};

export default Splash;

import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import ProductStack from './ScannerStack';
import BarCodeScannerScreen from '../screens/AddItem/BarcodeScanner';

const Stack = createStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator initialRouteName="MyTabs" mode="modal" headerMode="none">
      <Stack.Screen name="MyTabs" component={BottomTabNavigator} />
      <Stack.Screen
        name="BarCodeScannerScreen"
        component={BarCodeScannerScreen}
      />
    </Stack.Navigator>
  );
}

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AddItem from '../screens/AddItem';
import ScannedDetails from '../screens/AddItem/ScannedDetails';

const Stack = createStackNavigator();

export default function ScannerStack() {
  return (
    <Stack.Navigator
      initialRouteName="AddItemTab"
      mode="modal"
      headerMode="none"
    >
      <Stack.Screen
        name="AddItemTab"
        component={AddItem}
        initialParams={{ product: null }}
      />
      <Stack.Screen
        name="ScannedDetails"
        component={ScannedDetails}
        initialParams={{ product: null }}
      />
    </Stack.Navigator>
  );
}

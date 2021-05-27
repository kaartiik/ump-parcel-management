import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

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
    </Stack.Navigator>
  );
}

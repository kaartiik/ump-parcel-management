import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Shops from '../screens/Shops';

const Stack = createStackNavigator();

export default function ShopsStack() {
  return (
    <Stack.Navigator initialRouteName="Shops" mode="modal" headerMode="none">
      <Stack.Screen name="Shops" component={Shops} />
      {/* <Stack.Screen
        name="AddShop"
        component={AddShop}
        initialParams={{ barberShop: null }}
      /> */}
    </Stack.Navigator>
  );
}

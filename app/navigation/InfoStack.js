import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AddShop from '../screens/AddShop';
import BarberShopInfo from '../screens/AddShop/BarberShopInfo';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="BarberShopInfo"
      mode="modal"
      headerMode="none"
    >
      <Stack.Screen name="BarberShopInfo" component={BarberShopInfo} />
      <Stack.Screen
        name="AddShop"
        component={AddShop}
        initialParams={{ barberShop: null }}
      />
    </Stack.Navigator>
  );
}

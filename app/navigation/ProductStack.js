import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ViewProduct from '../screens/ViewProduct';
import EditProduct from '../screens/ViewProduct/EditProduct';

const Stack = createStackNavigator();

export default function ProductStack() {
  return (
    <Stack.Navigator
      initialRouteName="ViewProduct"
      mode="modal"
      headerMode="none"
    >
      <Stack.Screen name="ViewProduct" component={ViewProduct} />
      <Stack.Screen name="EditProduct" component={EditProduct} />
      {/* <Stack.Screen
        name="AddShop"
        component={AddShop}
        initialParams={{ barberShop: null }}
      /> */}
    </Stack.Navigator>
  );
}

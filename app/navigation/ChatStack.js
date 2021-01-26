import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Chats from '../screens/Chats';
import ChatScreen from '../screens/Chats/ChatScreen';

const Stack = createStackNavigator();

export default function ShopsStack() {
  return (
    <Stack.Navigator initialRouteName="Chats" mode="modal" headerMode="none">
      <Stack.Screen name="Chats" component={Chats} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      {/* <Stack.Screen
        name="AddShop"
        component={AddShop}
        initialParams={{ barberShop: null }}
      /> */}
    </Stack.Navigator>
  );
}

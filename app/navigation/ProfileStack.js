import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Profile from '../screens/Profile';
import EditProfile from '../screens/Profile/EditProfile';

const Stack = createStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator initialRouteName="Profile" mode="modal" headerMode="none">
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        initialParams={{ barberShop: null }}
      />
    </Stack.Navigator>
  );
}

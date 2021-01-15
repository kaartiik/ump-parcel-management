import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { useSelector } from 'react-redux';
import BottomTabNavigator from './BottomTabNavigator';
// import { AuthContext } from './AuthProvider';

const Stack = createStackNavigator();

export default function MainStack() {
  // const { isAdmin } = useContext(AuthContext);

  const { isAdmin } = useSelector((state) => ({
    isAdmin: state.userReducer.isAdmin,
  }));

  return (
    <Stack.Navigator initialRouteName="MyTabs" mode="modal" headerMode="none">
      <Stack.Screen name="MyTabs" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
}

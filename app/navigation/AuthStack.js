import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/Login';
import Register from '../screens/Register';

// import ForgotPassword from '../screens/ForgotPassword';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login" mode="modal" headerMode="none">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      {/* <Stack.Screen name="ForgotPassword" component={ForgotPassword} /> */}
    </Stack.Navigator>
  );
}

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Shops from '../screens/Shops';
import CalendarScreen from '../screens/Shops/CalendarScreen';
import ConfirmBooking from '../screens/Shops/ConfirmBooking';
import TimeSlots from '../screens/Shops/TimeSlots';

const Stack = createStackNavigator();

export default function ShopsStack() {
  return (
    <Stack.Navigator initialRouteName="Shops" mode="modal" headerMode="none">
      <Stack.Screen name="Shops" component={Shops} />
      <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
      <Stack.Screen name="ConfirmBooking" component={ConfirmBooking} />
      <Stack.Screen name="TimeSlots" component={TimeSlots} />
      {/* <Stack.Screen
        name="AddShop"
        component={AddShop}
        initialParams={{ barberShop: null }}
      /> */}
    </Stack.Navigator>
  );
}

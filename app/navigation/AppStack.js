import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import BottomTabNavigator from './BottomTabNavigator';
import { getBarberShop } from '../providers/actions/Barber';

const Stack = createStackNavigator();

export default function MainStack() {
  const dispatch = useDispatch();

  const { isAdmin } = useSelector((state) => ({
    isAdmin: state.userReducer.isAdmin,
  }));

  useEffect(() => {
    dispatch(getBarberShop());
  }, []);

  return (
    <Stack.Navigator initialRouteName="MyTabs" mode="modal" headerMode="none">
      <Stack.Screen name="MyTabs" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
}

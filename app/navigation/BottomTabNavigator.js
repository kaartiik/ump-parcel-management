import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import colours from '../providers/constants/colours';
import Home from '../screens/Home';
import MyItems from '../screens/MyItems';
import AddItem from '../screens/AddItem';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const { usertype, isLoading } = useSelector((state) => ({
    usertype: state.userReducer.usertype,
    isLoading: state.userReducer.isLoading,
  }));

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = 'ios-home';
          } else if (route.name === 'AddItemTab') {
            iconName = 'ios-add-outline';
          } else if (route.name === 'MyItemsTab') {
            iconName = 'ios-list-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: colours.themeSecondary,
        inactiveTintColor: colours.themePrimary,
        keyboardHidesTabBar: true,
        showLabel: false,
      }}
    >
      <Tab.Screen name="HomeTab" component={Home} />
      <Tab.Screen
        name="AddItemTab"
        component={AddItem}
        initialParams={{ product: null }}
      />
      <Tab.Screen name="MyItemsTab" component={MyItems} />
      {usertype === 'Admin' && (
        <Tab.Screen name="UsersTab" component={MyItems} />
      )}
    </Tab.Navigator>
  );
}

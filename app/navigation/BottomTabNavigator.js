import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import colours from '../providers/constants/colours';
import Home from '../screens/Home';
import ProfileStack from './ProfileStack';
import ChatStack from './ChatStack';
import AddItem from '../screens/AddItem';
import MyItems from '../screens/MyItems';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
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
          } else if (route.name === 'ProfileTab') {
            iconName = 'ios-person';
          } else if (route.name === 'ChatsTab') {
            iconName = 'ios-chatbubbles';
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
      <Tab.Screen name="ProfileTab" component={ProfileStack} />
      <Tab.Screen name="ChatsTab" component={ChatStack} />
    </Tab.Navigator>
  );
}

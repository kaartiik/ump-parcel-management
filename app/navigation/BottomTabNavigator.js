import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import colours from '../providers/constants/colours';
import Home from '../screens/Home';
import HomeBarber from '../screens/HomeBarber';
import ChatStack from './ChatStack';
import InfoStack from './InfoStack';
import ShopsStack from './ShopsStack';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const { isAdmin } = useSelector((state) => ({
    isAdmin: state.userReducer.isAdmin,
  }));

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'ios-home';
          } else if (route.name === 'HomeBarber') {
            iconName = 'ios-home';
          } else if (route.name === 'Info') {
            iconName = 'ios-information-circle';
          } else if (route.name === 'Shops') {
            iconName = 'ios-add-circle';
          } else if (route.name === 'Chats') {
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
      {isAdmin ? (
        <>
          <Tab.Screen name="HomeBarber" component={HomeBarber} />
          <Tab.Screen name="Info" component={InfoStack} />
        </>
      ) : (
        <>
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Shops" component={ShopsStack} />
        </>
      )}
      <Tab.Screen name="Chats" component={ChatStack} />
    </Tab.Navigator>
  );
}

import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import colours from '../providers/constants/colours';
import Home from '../screens/Home';
import InfoStack from './InfoStack';

// import { AuthContext } from './AuthProvider';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  // const { isAuthorized, isAdmin } = useContext(AuthContext);

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
          } else if (route.name === 'Info') {
            iconName = 'ios-add-circle';
          }
          // else if (route.name === 'Users') {
          //   iconName = 'ios-people';
          // } else if (route.name === 'Users') {
          //   iconName = 'ios-people';
          // } else if (route.name === 'Profile') {
          //   iconName = 'ios-person';
          // } else if (route.name === 'Chats') {
          //   iconName = 'ios-chatbubbles';
          // }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: colours.themeSecondary,
        inactiveTintColor: colours.themePrimary,
        keyboardHidesTabBar: true,
        // showLabel:  false
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Info" component={InfoStack} />
      {/* <Tab.Screen name="Users" component={Users} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Chats" component={HomeScreen} /> */}
    </Tab.Navigator>
  );
}

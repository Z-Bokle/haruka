import React from 'react';

import Home from './pages/Home';
import Sessions from './pages/Sessions';
import Settings from './pages/Settings';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-paper';

export type BottomTabParamList = {
  Home: undefined;
  Sessions: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

function Navigation() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: '首页',
          tabBarIcon: ({ color, size }) => {
            return <Icon source="home" color={color} size={size} />;
          },
        }}
      />
      <Tab.Screen
        name="Sessions"
        component={Sessions}
        options={{
          tabBarLabel: '会话',
          tabBarIcon: ({ color, size }) => {
            return <Icon source="robot" color={color} size={size} />;
          },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: '设置',
          tabBarIcon: ({ color, size }) => {
            return <Icon source="cog" color={color} size={size} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

function Main() {
  return <Navigation />;
}

export default Main;

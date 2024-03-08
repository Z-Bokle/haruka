import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Home from '../pages/Home';

const Stack = createStackNavigator();

export function HomeStackNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}

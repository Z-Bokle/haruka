import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Authorization from '../pages/Authorization';
import { BottomTabNavigation } from '../navigation/BottomTabNavigation';

const Stack = createStackNavigator();

export function GlobalStackNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Authorization" component={Authorization} />
      <Stack.Screen name="App" component={BottomTabNavigation} />
    </Stack.Navigator>
  );
}

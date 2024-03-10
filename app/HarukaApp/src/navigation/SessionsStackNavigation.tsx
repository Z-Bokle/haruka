import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Sessions from '../pages/Sessions';
// import SessionView from '../pages/SessionView';

const Stack = createStackNavigator();

export function SessionsStackNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Sessions" component={Sessions} />
    </Stack.Navigator>
  );
}

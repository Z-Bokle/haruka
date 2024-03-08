import React, { ReactNode, useCallback } from 'react';

import Home from '../pages/Home';
import Sessions from '../pages/Sessions';
import Settings from '../pages/Settings';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { BottomNavigation, Icon } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';

export type BottomTabParamList = {
  Home: undefined;
  Sessions: undefined;
  Settings: undefined;
};

const routes = [
  { name: 'Home', component: Home, key: 'home', icon: 'home', label: '首页' },
  {
    name: 'Sessions',
    component: Sessions,
    key: 'sessions',
    icon: 'robot',
    label: '会话',
  },
  {
    name: 'Settings',
    component: Settings,
    key: 'settings',
    icon: 'cog',
    label: '设置',
  },
];

const iconRender = (source: string, color: string, size: number) => {
  return <Icon source={source} color={color} size={size} />;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export function BottomTabNavigation() {
  const renderTabBar = useCallback<(props: BottomTabBarProps) => ReactNode>(
    ({ navigation, state, descriptors, insets }) => (
      <BottomNavigation.Bar
        navigationState={state}
        safeAreaInsets={insets}
        onTabPress={({ route, preventDefault }) => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (event.defaultPrevented) {
            preventDefault();
          } else {
            navigation.dispatch({
              ...CommonActions.navigate(route.name, route.params),
              target: state.key,
            });
          }
        }}
        renderIcon={({ route, focused, color }) => {
          const { options } = descriptors[route.key];
          if (options.tabBarIcon) {
            return options.tabBarIcon({ focused, color, size: 24 });
          }

          return null;
        }}
        getLabelText={({ route }) => {
          const { options } = descriptors[route.key];
          const label =
            (options.tabBarLabel as string) ?? options.title ?? route.name;

          return label;
        }}
      />
    ),
    [],
  );

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={renderTabBar}>
      {routes.map(route => {
        return (
          <Tab.Screen
            key={route.key}
            name={route.name as keyof BottomTabParamList}
            component={route.component}
            options={{
              tabBarLabel: route.label,
              tabBarIcon: ({ color, size }) => {
                return iconRender(route.icon, color, size);
              },
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
}

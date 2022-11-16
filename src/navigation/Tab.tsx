import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@ui-kitten/components';

import HomeScreen from '../screens/Home';
import InsightScreen from '../screens/Insight';
import LibraryScreen from '../screens/Library';
import LearnScreen from '../screens/Learn';
import { TabParamList } from '../types';

const Tab = createBottomTabNavigator<TabParamList>();

const getTabBarIcon = (routeName: string) => {
  switch (routeName) {
    case 'Home':
      return 'home-outline';
    case 'Insight':
      return 'bar-chart-outline';
    case 'Library':
      return 'book-open-outline';
    case 'Learn':
      return 'loader-outline';
    default:
      break;
  }
}

const TabNavigator = () => (
  <Tab.Navigator screenOptions={({ route }) => ({
    headerShown: false,
    tabBarIcon: ({ color, size }) => {
      const routeName = route.name;
      const tabBarIcon = getTabBarIcon(routeName);
      return <Icon fill={color} style={{ height: size, width: size }} name={tabBarIcon} />;
    }
  })}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Insight" component={InsightScreen} />
    <Tab.Screen name="Library" component={LibraryScreen} />
    <Tab.Screen name="Learn" component={LearnScreen} />
  </Tab.Navigator> 
)

export default TabNavigator;

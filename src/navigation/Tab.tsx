import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from '@ui-kitten/components';

import HomeScreen from '../screens/Home';
import AddMeditationsScreen from '../screens/AddMeditations';
import LibraryScreen from '../screens/Library';
import InsightScreen from '../screens/Insight';
import {TabParamList} from '../types';

const Tab = createBottomTabNavigator<TabParamList>();

const getTabBarIcon = (routeName: string) => {
  switch (routeName) {
    case 'Home':
      return 'home-outline';
    case 'Add':
      return 'plus';
    case 'Files':
      return 'folder-outline';
    case 'Insights':
      return 'bar-chart-outline';
    default:
      break;
  }
};

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      headerShown: false,
      tabBarIcon: ({color, size}) => {
        const routeName = route.name;
        const tabBarIcon = getTabBarIcon(routeName);
        return (
          <Icon
            fill={color}
            style={{height: size, width: size}}
            name={tabBarIcon}
          />
        );
      },
      tabBarActiveTintColor: '#9C4DCC',
      tabBarInactiveTintColor: '#6B7280',
      tabBarStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.88)',
        borderTopWidth: 0,
        paddingBottom: 26,
        paddingTop: 8,
        height: 90,
        position: 'absolute',
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 0,
      },
    })}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Add" component={AddMeditationsScreen} />
    <Tab.Screen name="Files" component={LibraryScreen} />
    <Tab.Screen name="Insights" component={InsightScreen} />
  </Tab.Navigator>
);

export default TabNavigator;

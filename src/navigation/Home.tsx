import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/Home';
import MeditationScreen from '../screens/Meditation';
import MeditationSyncScreen from '../screens/MeditationSync';
import { HomeStackParamList } from '../types';

const { Navigator, Screen } = createNativeStackNavigator<HomeStackParamList>();

const HomeNavigator = () => (
  <Navigator screenOptions={{ headerShown: false }}>
    <Screen name="HomeDashboard" component={HomeScreen} />
    <Screen name="MeditationSync" component={MeditationSyncScreen} />
    <Screen name="Meditation" component={MeditationScreen} />
  </Navigator>
)

export default HomeNavigator;

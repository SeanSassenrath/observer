import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/Home';
import MeditationScreen from '../screens/Meditation';
import MeditationPlayerModal from '../screens/MeditationPlayer';
import MeditationSyncScreen from '../screens/MeditationSync';
import { HomeStackParamList } from '../types';

const { Group, Navigator, Screen } = createNativeStackNavigator<HomeStackParamList>();

const HomeNavigator = () => (
  <Navigator screenOptions={{ headerShown: false }}>
    <Group>
      <Screen name="HomeDashboard" component={HomeScreen} />
      <Screen name="MeditationSync" component={MeditationSyncScreen} />
      <Screen name="Meditation" component={MeditationScreen} />
    </Group>
    <Group screenOptions={{ presentation: 'modal' }}>
      <Screen name="MeditationPlayer" component={MeditationPlayerModal} />
    </Group>
  </Navigator>
)

export default HomeNavigator;

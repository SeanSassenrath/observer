import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TrackPlayer from 'react-native-track-player';

import InitialUploadScreen from '../screens/InitialUpload';
import MeditationPlayerModal from '../screens/MeditationPlayer';
import MeditationScreen from '../screens/Meditation';
import SignInScreen from '../screens/SignIn';
import WelcomeScreen from '../screens/Welcome';
import TabNavigator from './Tab';
import { StackParamList } from '../types';

const { Group, Navigator, Screen } = createNativeStackNavigator<StackParamList>();

const MyTheme = {
  dark: false,
  colors: {
    primary: '#9147BB',
    background: '',
    card: '#1B2237',
    text: '#F1D0F9',
    border: '#1B2237',
    notification: '',
  },
};

const StackNavigator = () => {
  const setupPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      const playerState = await TrackPlayer.getState();
      console.log('Setup Player State', playerState);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    setupPlayer();
  }, [])

  return (
    <NavigationContainer theme={MyTheme}>
      <Navigator screenOptions={{ headerShown: false }}>
        <Screen name="Welcome" component={WelcomeScreen} />
        <Screen name="InitialUpload" component={InitialUploadScreen} />
        <Screen name="SignIn" component={SignInScreen} />
        <Screen name="Meditation" component={MeditationScreen} />
        <Screen name="TabNavigation" component={TabNavigator} />
        <Group screenOptions={{ presentation: 'modal' }}>
          <Screen name="MeditationPlayer" component={MeditationPlayerModal} />
        </Group>
      </Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator;
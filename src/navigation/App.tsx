import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TrackPlayer from 'react-native-track-player';

import HomeNavigator from './Home';
import InitialUploadScreen from '../screens/InitialUpload';
import SignInScreen from '../screens/SignIn';
import WelcomeScreen from '../screens/Welcome';
import { AppStackParamList } from '../types';

const { Navigator, Screen } = createNativeStackNavigator<AppStackParamList>();

const AppNavigator = () => {
  const setupPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      const playerState = await TrackPlayer.getState();
      console.log('Setup Player State', playerState);
    } catch(e) {
      console.log(e);
    }
  }

  useEffect(() => {
    setupPlayer();
  }, []) 

  return (
    <NavigationContainer>
      <Navigator screenOptions={{ headerShown: false }}>
        <Screen name="Welcome" component={WelcomeScreen} />
        <Screen name="InitialUpload" component={InitialUploadScreen} />
        <Screen name="SignIn" component={SignInScreen} />
        <Screen name="Home" component={HomeNavigator} />
      </Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator;

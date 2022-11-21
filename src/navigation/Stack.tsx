import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TrackPlayer from 'react-native-track-player';

import FtuxContext from '../contexts/ftuxData';
import { myTheme } from '../constants/navTheme';
import InitialUploadScreen from '../screens/InitialUpload';
import MeditationFinishScreen from '../screens/MeditationFinish';
import MeditationPlayerModal from '../screens/MeditationPlayer';
import MeditationScreen from '../screens/Meditation';
import SignInScreen from '../screens/SignIn';
import WelcomeScreen from '../screens/Welcome';
import TabNavigator from './Tab';
import { StackParamList } from '../types';
import DebugScreen from '../screens/Debug';

const { Navigator, Screen } = createNativeStackNavigator<StackParamList>();

const StackNavigator = () => {
  const { hasSeenFtux } = useContext(FtuxContext);
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
    <NavigationContainer theme={myTheme}>
      <Navigator
        initialRouteName={hasSeenFtux ? "TabNavigation" : "Welcome"}
        screenOptions={{ headerShown: false }}
      >
        <Screen name="Welcome" component={WelcomeScreen} />
        <Screen name="InitialUpload" component={InitialUploadScreen} />
        <Screen name="SignIn" component={SignInScreen} />
        <Screen name="TabNavigation" component={TabNavigator} />
        <Screen name="Meditation" component={MeditationScreen} />
        <Screen name="MeditationFinish" component={MeditationFinishScreen} />
        <Screen name="MeditationPlayer" component={MeditationPlayerModal} />
        <Screen name="Debug" component={DebugScreen} />
      </Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator;

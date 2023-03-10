import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import FtuxContext from '../contexts/ftuxData';
import { myTheme } from '../constants/navTheme';
import InitialUploadScreen from '../screens/InitialUpload';
import MeditationFinishScreen from '../screens/MeditationFinish';
import MeditationPlayerModal from '../screens/MeditationPlayer';
import MeditationScreen from '../screens/Meditation';
import SignInScreen from '../screens/SignIn';
import AddFilesTutorial1 from '../screens/AddFilesTutorial1';
import AddFilesTutorial2 from '../screens/AddFilesTutorial2';
import AddFilesTutorial3 from '../screens/AddFilesTutorial3';
import AddFilesTutorial4 from '../screens/AddFilesTutorial4';
import TabNavigator from './Tab';
import { StackParamList } from '../types';
import DebugScreen from '../screens/Debug';
import UserContext from '../contexts/userData';

const { Navigator, Screen } = createNativeStackNavigator<StackParamList>();

const StackNavigator = () => {
  const { hasSeenFtux } = useContext(FtuxContext);
  const { user } = useContext(UserContext);

  return (
    <NavigationContainer theme={myTheme}>
      <Navigator
        initialRouteName={(user && user.uid.length <= 0) ? "Welcome" : "TabNavigation"}
        screenOptions={{ headerShown: false }}
      >
        <Screen name="AddFilesTutorial1" component={AddFilesTutorial1} />
        <Screen name="AddFilesTutorial2" component={AddFilesTutorial2} />
        <Screen name="AddFilesTutorial3" component={AddFilesTutorial3} />
        <Screen name="AddFilesTutorial4" component={AddFilesTutorial4} />
        <Screen name="SignIn" component={SignInScreen} />
        <Screen name="InitialUpload" component={InitialUploadScreen} />
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

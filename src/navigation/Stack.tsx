import React, { useContext, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
import BetaCheck from '../screens/BetaCheck';
import Loading from '../screens/Loading';
import TabNavigator from './Tab';
import { StackParamList } from '../types';
import DebugScreen from '../screens/Debug';
import UserContext from '../contexts/userData';
import FtuxContext from '../contexts/ftuxData';

const { Navigator, Screen } = createNativeStackNavigator<StackParamList>();

const StackNavigator = () => {
  const { user } = useContext(UserContext);
  const { hasSeenFtux } = useContext(FtuxContext);

  const getInitialRouteName = () => {
    if (user.uid.length <= 0) {
      return "SignIn";
    } else if (!user.hasBetaAccess) {
      return "BetaCheck";
    } else if (!hasSeenFtux) {
      return "AddFilesTutorial1";
    } else {
      return "TabNavigation";
    }
  }

  return (
    <NavigationContainer theme={myTheme}>
      <Navigator
        initialRouteName={getInitialRouteName()}
        screenOptions={{ headerShown: false }}
      >
        <Screen name="SignIn" component={SignInScreen} />
        <Screen name="BetaCheck" component={BetaCheck} />
        <Screen name="AddFilesTutorial1" component={AddFilesTutorial1} />
        <Screen name="AddFilesTutorial2" component={AddFilesTutorial2} />
        <Screen name="AddFilesTutorial3" component={AddFilesTutorial3} />
        <Screen name="AddFilesTutorial4" component={AddFilesTutorial4} />
        <Screen name="InitialUpload" component={InitialUploadScreen} />
        <Screen name="TabNavigation" component={TabNavigator} />
        <Screen name="Meditation" component={MeditationScreen} />
        <Screen name="MeditationFinish" component={MeditationFinishScreen} />
        <Screen name="MeditationPlayer" component={MeditationPlayerModal} />
        <Screen name="Debug" component={DebugScreen} />
        <Screen name="Loading" component={Loading} />
      </Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator;

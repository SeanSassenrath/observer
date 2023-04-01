import React, { useContext, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import analytics from '@react-native-firebase/analytics';

import { myTheme } from '../constants/navTheme';
import MeditationFinishScreen from '../screens/MeditationFinish';
import MeditationPlayerModal from '../screens/MeditationPlayer';
import MeditationScreen from '../screens/Meditation';
import SignInScreen from '../screens/SignIn';
import BetaCheck from '../screens/BetaCheck';
import TabNavigator from './Tab';
import { StackParamList } from '../types';
import DebugScreen from '../screens/Debug';
import UserContext from '../contexts/userData';
import OnboardingStep1 from '../screens/OnboardingStep1';
import OnboardingStep2 from '../screens/OnboardingStep2';

const { Navigator, Screen } = createNativeStackNavigator<StackParamList>();

const StackNavigator = () => {
  const { user } = useContext(UserContext);
  const routeNameRef: any = useRef({});
  const navigationRef: any = useRef({});

  const getInitialRouteName = () => {
    if (user.uid.length <= 0) {
      return "SignIn";
    } else if (!user.hasBetaAccess) {
      return "BetaCheck";
    } else {
      return "TabNavigation";
    }
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.current.getCurrentRoute().name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;

        if (
          previousRouteName !== currentRouteName &&
          (currentRouteName !== 'RNSScreen' || currentRouteName !== 'UIViewController')
        ) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        routeNameRef.current = currentRouteName;
      }}
      theme={myTheme}
    >
      <Navigator
        initialRouteName={getInitialRouteName()}
        screenOptions={{ headerShown: false }}
      >
        <Screen name="SignIn" component={SignInScreen} />
        <Screen name="BetaCheck" component={BetaCheck} />
        <Screen name="TabNavigation" component={TabNavigator} />
        <Screen name="Meditation" component={MeditationScreen} />
        <Screen name="MeditationFinish" component={MeditationFinishScreen} />
        <Screen name="MeditationPlayer" component={MeditationPlayerModal} />
        <Screen name="Debug" component={DebugScreen} />
        <Screen name="OnboardingStep1" component={OnboardingStep1} />
        <Screen name="OnboardingStep2" component={OnboardingStep2} />
      </Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator;

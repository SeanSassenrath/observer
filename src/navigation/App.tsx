import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/Home';
import SignInScreen from '../screens/SignIn';
import { AppStackParamList } from '../types';

const { Navigator, Screen } = createNativeStackNavigator<AppStackParamList>();

const AppNavigator = () => (
  <NavigationContainer>
    <Navigator screenOptions={{ headerShown: false }}>
        <Screen name="SignIn" component={SignInScreen}/>
        <Screen name="Home" component={HomeScreen}/>
    </Navigator>
  </NavigationContainer>
)

export default AppNavigator;

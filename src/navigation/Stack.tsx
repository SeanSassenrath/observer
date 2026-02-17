import React, {useContext, useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import analytics from '@react-native-firebase/analytics';
import {PostHogProvider, usePostHog} from 'posthog-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {POSTHOG_API_KEY} from '@env';

import {myTheme} from '../constants/navTheme';
import MeditationFinishScreen from '../screens/MeditationFinish';
import MeditationPlayerModal from '../screens/MeditationPlayer';
import MeditationScreen from '../screens/Meditation';
import SignInScreen from '../screens/SignIn';
import TabNavigator from './Tab';
import {StackParamList} from '../types';
import UserContext from '../contexts/userData';
import BetaAgreement from '../screens/BetaAgreement';
import AddMeditationsScreen from '../screens/AddMeditations';
import Profile from '../screens/Profile';
import AddMedsMatchingScreen from '../screens/AddMedsMatching';
import AddMedsSuccessScreen from '../screens/AddMedSuccess';
import UnrecognizedFilesScreen from '../screens/UnrecognizedFiles';
import MeditationMatchScreen from '../screens/MeditationMatch';
import FeedbackScreen from '../screens/Feedback';
// import SubscriptionsScreen from '../screens/Subscriptions';
// import PurchaseOnboarding from '../screens/PurchaseOnboarding';
// import Purchase from '../screens/Purchase';
import LimitedVersion from '../screens/LimitedVersion';
import Disclaimer from '../screens/Disclaimer';
import TermsAgreementScreen from '../screens/TermsAgreement';
import PurchaseOnboarding from '../screens/PurchaseOnboarding';
import WelcomeScreen from '../screens/Welcome';
import EmailSignInScreen from '../screens/EmailSignIn';
import ReassignFileScreen from '../screens/ReassignFile';
import PlaylistsScreen from '../screens/Playlists';
import CreatePlaylistScreen from '../screens/CreatePlaylist';
import EditPlaylistScreen from '../screens/EditPlaylist';
import PlaylistPreparationScreen from '../screens/PlaylistPreparation';
import SubmitMeditationScreen from '../screens/SubmitMeditation';
import MeditationSelectorScreen from '../screens/MeditationSelector';

const {Navigator, Screen} = createNativeStackNavigator<StackParamList>();

const PostHogIdentifier = () => {
  const posthog = usePostHog();
  const {user} = useContext(UserContext);

  useEffect(() => {
    if (user.uid) {
      posthog.identify(user.uid, {
        email: user.profile?.email,
        name: user.profile?.displayName,
      });
    }
  }, [user.uid]);

  return null;
};

const StackNavigator = () => {
  const {user} = useContext(UserContext);
  const routeNameRef: any = useRef({});
  const navigationRef: any = useRef({});

  const getInitialRouteName = () => {
    if (user.uid.length <= 0) {
      return 'PurchaseOnboarding';
    } else if (!user.termsAgreement?.hasAccepted) {
      return 'TermsAgreement';
    } else {
      return 'TabNavigation';
    }
  };

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
          (currentRouteName !== 'RNSScreen' ||
            currentRouteName !== 'UIViewController' ||
            currentRouteName !== 'RCTModalHostViewController')
        ) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        routeNameRef.current = currentRouteName;
      }}
      theme={myTheme}>
      <PostHogProvider apiKey={POSTHOG_API_KEY}
        autocapture
        options={{
          host: "https://us.i.posthog.com",
          customStorage: AsyncStorage,
        }}
      >
      <PostHogIdentifier />
      <Navigator
        initialRouteName={getInitialRouteName()}
        screenOptions={{headerShown: false}}>
        <Screen name="Welcome" component={WelcomeScreen} />
        <Screen name="SignIn" component={SignInScreen} />
        <Screen name="EmailSignIn" component={EmailSignInScreen} />
        {/* <Screen name="Subscriptions" component={SubscriptionsScreen} /> */}
        <Screen name="BetaAgreement" component={BetaAgreement} />
        <Screen name="Disclaimer" component={Disclaimer} />
        <Screen name="AddMeditations" component={AddMeditationsScreen} />
        <Screen name="AddMedsMatching" component={AddMedsMatchingScreen} />
        <Screen name="AddMedsSuccess" component={AddMedsSuccessScreen} />
        <Screen name="TabNavigation" component={TabNavigator} />
        <Screen name="Meditation" component={MeditationScreen} />
        <Screen name="MeditationFinish" component={MeditationFinishScreen} />
        <Screen name="MeditationPlayer" component={MeditationPlayerModal} />
        <Screen name="MeditationMatch" component={MeditationMatchScreen} />
        <Screen name="LimitedVersion" component={LimitedVersion} />
        <Screen name="Profile" component={Profile} />
        {/* <Screen name="Purchase" component={Purchase} /> */}
        <Screen name="PurchaseOnboarding" component={PurchaseOnboarding} />
        <Screen name="UnrecognizedFiles" component={UnrecognizedFilesScreen} />
        <Screen name="Feedback" component={FeedbackScreen} />
        <Screen name="ReassignFile" component={ReassignFileScreen} />
        <Screen name="TermsAgreement" component={TermsAgreementScreen} />
        <Screen name="Playlists" component={PlaylistsScreen} />
        <Screen name="CreatePlaylist" component={CreatePlaylistScreen} />
        <Screen name="EditPlaylist" component={EditPlaylistScreen} />
        <Screen name="PlaylistPreparation" component={PlaylistPreparationScreen} />
        <Screen name="SubmitMeditation" component={SubmitMeditationScreen} />
        <Screen name="MeditationSelector" component={MeditationSelectorScreen} />
      </Navigator>
      </PostHogProvider>
    </NavigationContainer>
  );
};

export default StackNavigator;

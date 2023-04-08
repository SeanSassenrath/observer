import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppState, SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Layout,
  Spinner,
  Text,
} from '@ui-kitten/components';
import Animated, { FadeInDown } from 'react-native-reanimated';

import UserContext from '../contexts/userData';
import { fbFetchBetaUserList, fbSetUserBetaAccessState } from '../utils/fbBetaUserList';

const RequestInvite = () => {
  const { user } = useContext(UserContext);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isCheckingBetaStatus, setIsCheckingBetaStatus] = useState(false);
  const [isNotInBeta, setIsNotInBeta] = useState(false);
  const appState = useRef(AppState.currentState);
  const navigation = useNavigation();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!')
        checkForBetaStatusUpdate();
      }

      appState.current = nextAppState;
    });

    checkForBetaStatusUpdate();

    return () => subscription.remove();
  }, [user.profile.email])

  const checkForBetaStatusUpdate = async () => {
    setIsCheckingBetaStatus(true);
    const isUserInBeta = await isUserInBetaCheck();

    if (user && user.profile && user.profile.email) {
      await showBetaStatusCheckIndictator();

      if (isUserInBeta) {
        setIsNotInBeta(false)
        setIsNavigating(true);
        await fbSetUserBetaAccessState(user);
        await showAccessGrantedIndictator();

        if (
          user &&
          user.onboarding &&
          user.onboarding.hasSeenAddMeditationOnboarding
        ) {
          navigation.navigate('TabNavigation');
        } else {
          navigation.navigate('OnboardingStep1');
        }
      } else {
        setIsNotInBeta(true)
      }
    }
  }

  const isUserInBetaCheck = async () => {
    const betaUserList = await fbFetchBetaUserList();
    console.log('betaUserList', betaUserList);
    if (!betaUserList) { return; }
    const { list } = betaUserList;
    console.log('list', list);
    console.log('user.profile.email', user.profile.email);
    console.log('here', list.includes(user.profile.email))
    return list.includes(user.profile.email);
  }

  const showBetaStatusCheckIndictator = () => new Promise(
    resolve => (setTimeout(() => {
      setIsCheckingBetaStatus(false);
      resolve(null);
    }, 2000)
  ));

  const showAccessGrantedIndictator = () => new Promise(
    resolve => (setTimeout(() => {
      resolve(null);
    }, 2500)
    ));

  const renderSpinner = () => {
    if (isCheckingBetaStatus) {
      return (
        <Layout level='4' style={styles.spinnerContainer}>
          <Spinner />
        </Layout>
      )
    } else {
      return null;
    }
  }

  const renderStatusHeader = () => {
    if (isCheckingBetaStatus) {
      return (
        <Text
          category='h5'
          style={styles.textHeader}
        >
          Checking beta status...
        </Text>
      )
    } else if (isNotInBeta) {
      return (
        <Text
          category='h5'
          status='warning'
          style={styles.textHeader}
        >
          Join us as a beta tester!
        </Text>
      )
    } else if (isNavigating) {
      return (
        <Text
          category='h5'
          status='success'
          style={styles.textHeader}
        >
          Unlocking the beta now...
        </Text>
      )
    }
  }

  const renderStatusMessage = () => {
    if (isCheckingBetaStatus) {
      return (
        <Text category='s1' style={styles.textDescription}>We're double checking if you have access to the beta, thank you for your patience!</Text>
      )
    } else if (isNotInBeta) {
      return (
        <>
          <Text category='s1' style={styles.textDescription}>
            Hi {user.profile.firstName}, we'll try and get you added to the beta as soon as possible!
          </Text>
        </>
      )
    } else if (isNavigating) {
      return <Text category='s1' style={styles.textDescription}>Beta access confirmed. Thank you for being a beta tester!</Text>
    }
  }

  return (
    <Layout level='4' style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout level='4' style={styles.contentContainer}>
          <Animated.View
            key={'uniqueKey'}
            entering={FadeInDown.duration(400)}
          >
            {renderSpinner()}
            {renderStatusHeader()}
            {renderStatusMessage()}
          </Animated.View>
        </Layout>
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    flex: 1,
  },
  imgContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  spinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  textHeader: {
    marginBottom: 20,
    textAlign: 'center',
  },
  textDescription: {
    lineHeight: 23,
    marginBottom: 20,
    textAlign: 'center',
    maxWidth: 300,
  },
})

export default RequestInvite;

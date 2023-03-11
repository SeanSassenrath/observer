import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppState, ImageBackground, SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Layout,
  Text,
} from '@ui-kitten/components';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';


import UserContext from '../contexts/userData';
import FtuxContext from '../contexts/ftuxData';
import { fbFetchBetaUserList, fbSetUserBetaAccessState } from '../utils/fbBetaUserList';

const RequestInvite = () => {
  const { user } = useContext(UserContext);
  const { hasSeenFtux } = useContext(FtuxContext);
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
  }, [])

  const checkForBetaStatusUpdate = async () => {
    setIsCheckingBetaStatus(true);
    const isUserInBeta = await isUserInBetaCheck();
    await showBetaStatusCheckIndictator();

    if (isUserInBeta) {
      setIsNotInBeta(false)
      setIsNavigating(true);
      await fbSetUserBetaAccessState(user);
      await showAccessGrantedIndictator();

      if (hasSeenFtux) {
        navigation.navigate('TabNavigation');
      } else {
        navigation.navigate('AddFilesTutorial1');
      }
    } else {
      setIsNotInBeta(true)
    }
  }

  const isUserInBetaCheck = async () => {
    const betaUserList = await fbFetchBetaUserList();
    if (!betaUserList) { return; }
    const { list } = betaUserList;
    return list.includes(user.profile.email);
  }

  const showBetaStatusCheckIndictator = () => new Promise(
    resolve => (setTimeout(() => {
      setIsCheckingBetaStatus(false);
      resolve(null);
    }, 2500)
  ));

  const showAccessGrantedIndictator = () => new Promise(
    resolve => (setTimeout(() => {
      resolve(null);
    }, 2500)
    ));

  const renderStatusHeader = () => {
    if (isCheckingBetaStatus) {
      return (
        <Text
          category='h5'
          status='info'
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
          Unlocking the beta now!
        </Text>
      )
    }
  }

  const renderStatusMessage = () => {
    if (isCheckingBetaStatus) {
      return (
        <Text category='s1'>We're double checking if you have access to the beta, thank you for your patience!</Text>
      )
    } else if (isNotInBeta) {
      return (
        <>
          <Text category='s1' style={styles.textDescription}>
            Hi {user.profile.firstName}, we are so grateful that you want to be a part of this experience! We're currently limiting the number of users while we are in beta
            so we can ensure the best possible experience for everyone once it's ready.
          </Text>
          <Text category='s1' style={styles.textDescription}>
            If you'd like to be a part of the beta,
            please send an email to test@test.com and we will try to add you as soon as we can. We look forward to hearing from you!
          </Text>
        </>
      )
    } else if (isNavigating) {
      return <Text category='s1' style={styles.textDescription}>Beta access confirmed! Thank you for being a beta tester!</Text>
    }
  }

  return (
    <Layout style={styles.rootContainer}>
      <SafeAreaView style={styles.container}>
        <ImageBackground source={require('../assets/stars.png')} style={styles.container}>
          <LinearGradient colors={['rgba(34, 43, 69, 0)', 'rgba(34, 43, 69, 1)']} style={styles.imgContainer}>
            <Layout style={styles.imgContainer}>
            </Layout>
          </LinearGradient>
          <Layout style={styles.bottomContainer}>
            <Layout style={styles.textContainer}>
              <Animated.View
                key={'uniqueKey'}
                entering={FadeInDown.duration(400)}
              >
                {renderStatusHeader()}
                {renderStatusMessage()}
              </Animated.View>
            </Layout>
          </Layout>
        </ImageBackground>
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 20,
    width: 350
  },
  buttonContainer: {
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1,
    paddingBottom: 40,
  },
  container: {
    flex: 1,
  },
  disclaimer: {
    marginBottom: 30,
    marginTop: 20,
  },
  imgContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  rootContainer: {
    flex: 1,
    padding: 20,
  },
  textContainer: {
    flex: 3,
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
  },
  textHeader: {
    marginBottom: 20,
  },
  textDescription: {
    lineHeight: 23,
    marginBottom: 20,
  },
})

export default RequestInvite;

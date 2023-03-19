import React, { useContext, useState } from 'react';
import { Image, Platform, SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
	Layout,
	Text,
  useStyleSheet,
} from '@ui-kitten/components';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

import Button from '../components/Button';
import { InitialUploadScreenNavigationProp } from '../types';
import FtuxContext from '../contexts/ftuxData';

const SignInScreen = () => {
  const styles = useStyleSheet(themedStyles);
  const navigation = useNavigation<InitialUploadScreenNavigationProp>();
  const [isSignInPending, setIsSignInPending] = useState(false);

  const signIn = async () => {
    let userInfo;
    try {
      setIsSignInPending(true);
      await GoogleSignin.hasPlayServices();
      userInfo = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);

      const { user } = userInfo;
      if (!user) { return; }

      await auth().signInWithCredential(googleCredential);

      navigation.navigate('BetaCheck');
  
      // const betaUserList = await fbFetchBetaUserList();
      // if (!betaUserList) { return; }
      // const { list } = betaUserList;
      // const isUserInBeta = list.includes(user.email);

      // if (!isUserInBeta) {
      //   navigation.navigate('RequestInvite');
      // } else if (!hasSeenFtux) {
      //   navigation.navigate('AddFilesTutorial1');
      // } else {
      //   navigation.navigate('TabNavigation');
      // }
      setIsSignInPending(false);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        // TODO: Add metric here for monitoring
        // TODO: Add error handling
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        // TODO: Add metric here for monitoring
        // TODO: Add error handling
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        // TODO: Add metric here for monitoring
        // TODO: Add error handling
      } else {
        // some other error happened
        // TODO: Add metric here for monitoring
        // TODO: Add error handling
      }
    }
  };

  return (
    <Layout level='4' style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout level='4' style={styles.contentContainer}>
          <Layout level='4' style={styles.headerContainer}>
            <Image
              source={require('../assets/app-icon-new-1200.png')}
              style={imageStyles.headerImage}
            />
          </Layout>
          <Layout level='4' style={styles.heroContainer}>
            <Layout level='4' style={styles.textContainer}>
              <Layout level='4' style={styles.textHeaderContainer}>
                <Text category='h3' style={styles.textHeader}>Be Your Own Scientist.</Text>
                <Text category='h3' style={styles.textHeaderPrimary}>Change your life.</Text>
              </Layout>
              <Text category='s2' style={styles.textDescription}>
                Meditation player, tracker, & “thinkbox” journal
                for your Dr. Joe Dispenza practice.
              </Text>
            </Layout>
          </Layout>
          <Layout level='4' style={styles.bottomContainer}>
            <Layout level='4' style={styles.buttonsContainer}>
              { Platform.OS === 'ios'
                ? <Button onPress={signIn} size='large' style={styles.button}>Sign in with Apple</Button>
                : null
              }
              <Button onPress={signIn} size='large' style={styles.button}>Sign in with Google</Button>
            </Layout>
          </Layout>
        </Layout>
      </SafeAreaView>
    </Layout>
  )
}

const imageStyles = StyleSheet.create({
  headerImage: {
    width: 60,
    height: 60,
  },
})

const themedStyles = StyleSheet.create({
  button: {
    marginVertical: 16,
    width: 300
  },
  buttonsContainer: {
    flex: 5,
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 3,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  disclaimer: {
    marginBottom: 30,
    marginTop: 20,
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  heroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 7,
  },
  textHeaderContainer: {
    marginBottom: 16,
  },
  textHeader: {
    textAlign: 'center',
  },
  textHeaderPrimary: {
    marginTop: 4,
    textAlign: 'center',
  },
  textDescription: {
    lineHeight: 23,
    textAlign: 'center',
  },
})

export default SignInScreen;

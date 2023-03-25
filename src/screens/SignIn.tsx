import React, { useState } from 'react';
import { Image, Platform, SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import crashlytics from '@react-native-firebase/crashlytics';
import {
	Layout,
	Text,
  useStyleSheet,
} from '@ui-kitten/components';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

import Button from '../components/Button';
import { InitialUploadScreenNavigationProp } from '../types';

const softBlack = '#1B1C22';

const SignInScreen = () => {
  const styles = useStyleSheet(themedStyles);
  const navigation = useNavigation<InitialUploadScreenNavigationProp>();
  const [isSignInPending, setIsSignInPending] = useState(false);

  const signIn = async () => {
    crashlytics().log('User signed in.');
    let userInfo;
    try {
      setIsSignInPending(true);
      await GoogleSignin.hasPlayServices();
      userInfo = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
      const { user } = userInfo;

      if (!user) {
        crashlytics().log('ERROR: Empty user object after sign up');
        return;
      }

      crashlytics().setUserId(user.id),

      await auth().signInWithCredential(googleCredential);

      navigation.navigate('BetaCheck');
  
      setIsSignInPending(false);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        crashlytics().recordError(error);
        // user cancelled the login flow
        // TODO: Add metric here for monitoring
        // TODO: Add error handling
      } else if (error.code === statusCodes.IN_PROGRESS) {
        crashlytics().recordError(error);

        // operation (e.g. sign in) is in progress already
        // TODO: Add metric here for monitoring
        // TODO: Add error handling
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        crashlytics().recordError(error);
        // play services not available or outdated
        // TODO: Add metric here for monitoring
        // TODO: Add error handling
      } else {
        crashlytics().recordError(error);

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
                ? <Button
                    onPress={signIn}
                    size='large'
                    status='control'
                    style={styles.button}
                  >
                    <>
                      <Image
                        source={require('../assets/apple-icon.png')}
                        style={imageStyles.ssoLogo}
                      />
                      <Text
                        status='basic'
                        category='s1'
                        style={styles.ssoText}
                      >
                        Sign in with Apple
                      </Text>
                    </>
                  </Button>
                : null
              }
              <Button
                onPress={signIn}
                size='large'
                status='control'
                style={styles.button}
              >
                <>
                  <Image
                    source={require('../assets/google-icon.png')}
                    style={imageStyles.ssoLogoGoogle}
                  />
                  <Text
                    status='basic'
                    category='s1'
                    style={styles.ssoText}
                  >
                    Sign in with Google
                  </Text>
                </>
              </Button>
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
  ssoLogo: {
    height: 20,
    width: 20,
    marginTop: -2,
  },
  ssoLogoGoogle: {
    height: 28,
    width: 28,
  }
})

const themedStyles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    opacity: 0.95,
    width: 300,
    height: 20,
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
  ssoText: {
    color: softBlack,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  textContainer: {
    alignItems: 'center',
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
    maxWidth: 300,
    opacity: 0.7,
  },
})

export default SignInScreen;

import React, { useContext, useState } from 'react';
import { Image, ImageBackground, SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
	Layout,
	Text,
  useStyleSheet,
} from '@ui-kitten/components';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

import Button from '../components/Button';
import { InitialUploadScreenNavigationProp, SignInScreenNavigationProp } from '../types';
import FtuxContext from '../contexts/ftuxData';
// import { fbFetchBetaUserList } from '../utils/fbBetaUserList';

const SignInScreen = () => {
  const styles = useStyleSheet(themedStyles);
  const navigation = useNavigation<InitialUploadScreenNavigationProp>();
  const [isSignInPending, setIsSignInPending] = useState(false);
  const { hasSeenFtux } = useContext(FtuxContext);

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
    <Layout style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.contentContainer}>
          <Layout style={styles.headerContainer}>
            <Image
              source={require('../assets/app-icon-new-1200.png')}
              style={imageStyles.headerImage}
            />
            <Layout>
              <Text category='s2'>Unlimited</Text>
              <Text category='s2'>Meditation</Text>
            </Layout>
          </Layout>
          <Layout style={styles.signUpImageContainer}>
              <Image
                source={require('../assets/insights-image.png')}
                style={imageStyles.signUpImage}
              />
          </Layout>
          <Layout style={styles.bottomContainer}>
            <Layout style={styles.textContainer}>
              <Layout style={styles.textHeaderContainer}>
                <Text category='h4'>Be Your Own Scientist.</Text>
                <Text category='h4' style={styles.textHeaderPrimary}>Change your life.</Text>
              </Layout>
              <Text category='s1' style={styles.textDescription}>
                Meditation player, tracker, and “thinkbox” journal
                for your Dr. Joe Dispenza practice.
              </Text>
            </Layout>
            <Layout style={styles.buttonContainer}>
              <Button onPress={signIn} size='large' style={styles.button}>Continue with Google</Button>
            </Layout>
          </Layout>
        </Layout>
      </SafeAreaView>
    </Layout>
  )
}

const imageStyles = StyleSheet.create({
  headerImage: {
    width: 50,
    height: 50,
  },
  signUpImage: {
    resizeMode: 'contain',
    flex: 1,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  
  },
})

const themedStyles = StyleSheet.create({
  button: {
    marginVertical: 10,
    width: 350
  },
  buttonContainer: {
    alignItems: 'center',
    flex: 2
  },
  bottomContainer: {
    flex: 4,
    paddingBottom: 40,
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
    // backgroundColor: 'red',
    flex: 0,
  },
  signUpImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 6,
    marginVertical: 30,
  },
  textContainer: {
    flex: 8,
    // alignContent: 'center',
    // justifyContent: 'center',
  },
  textHeaderContainer: {
    marginBottom: 16,
  },
  textHeaderPrimary: {
    color: 'color-primary-200',
    marginTop: 4,
  },
  textDescription: {
    lineHeight: 23
  },
})

export default SignInScreen;

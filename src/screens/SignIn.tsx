import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
	Layout,
	Text,
} from '@ui-kitten/components';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import Button from '../components/Button';
import { InitialUploadScreenNavigationProp, SignInScreenNavigationProp } from '../types';

const SignInScreen = () => {
  // const navigation = useNavigation<SignInScreenNavigationProp>();
  const navigation = useNavigation<InitialUploadScreenNavigationProp>();
  const [isSignInPending, setIsSignInPending] = useState(false);


  // const onContinuePress = () => navigation.navigate('InitialUpload');
  const onContinuePress = () => navigation.navigate('TabNavigation');

  // sign in
  // get user id
  // look up if use id is in firestore
  // if not
    // create a new user with that id
    // take to ftux
  // if so
    // take to home


  const signIn = async () => {
    let userInfo;
    try {
      setIsSignInPending(true);
      await GoogleSignin.hasPlayServices();
      userInfo = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
      const { user } = userInfo;

      if (!user) {
        return;
      }

      firestore()
        .collection('users')
        .doc(user.id)
        .get()
        .then(documentSnapshot => {
          if (documentSnapshot.exists) {
            // TODO: Add to async storage
            console.log('User data: ', documentSnapshot.data());
          } else {
            firestore()
              .collection('users')
              .add({
                providerId: user.id,
                createdAt: firestore.FieldValue.serverTimestamp(),
                ...user
              })
              .then(() => {
                // TODO: Add metric here for monitoring
              })
              .catch(() => {
                // TODO: Add metric here for monitoring
              })
          }
        });

      auth().signInWithCredential(googleCredential);
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
    <Layout style={styles.rootContainer}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.topContainer}>
        </Layout>
        <></>
        <Layout style={styles.bottomContainer}>
          <Layout style={styles.buttonContainer}>
            <Button onPress={signIn} size='large' style={styles.button}>Sign In With Google</Button>
          </Layout>
          <Layout style={styles.buttonContainer}>
            <Button onPress={onContinuePress} size='large' style={styles.button}>Sign in With Apple</Button>
          </Layout>
          <Text category='p2' style={styles.disclaimer}>
            Accounts are required to give you more information about your meditations.
            We will never sell your data to anyone.
          </Text>
          {isSignInPending
            ? <Text>Signing you in now...</Text>
            : null
          }
        </Layout>
      </SafeAreaView>
    </Layout>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
  disclaimer: {
    marginBottom: 30,
    marginTop: 20,
  },
	topContainer: {
		alignItems: 'center',
    justifyContent: 'center',
		flex: 7,
		padding: 20,
	},
	bottomContainer: {
    paddingBottom: 10,
		flex: 3,
	},
	button: {
    marginVertical: 20,
		width: 250
	},
  buttonContainer: {
    marginVertical: 10,
  },
  rootContainer: {
    flex: 1,
    padding: 20,
  },
});

export default SignInScreen;

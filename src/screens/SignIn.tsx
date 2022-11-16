import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
	Layout,
	Text,
} from '@ui-kitten/components';

import Button from '../components/Button';
import { SignInScreenNavigationProp } from '../types';

const SignInScreen = () => {
  const navigation = useNavigation<SignInScreenNavigationProp>();

  const onContinuePress = () => navigation.navigate('InitialUpload');

	return (
    <Layout style={styles.rootContainer}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.topContainer}>
        </Layout>
        <></>
        <Layout style={styles.bottomContainer}>
          <Layout style={styles.buttonContainer}>
            <Button onPress={onContinuePress} size='large' style={styles.button}>Sign In With Google</Button>
          </Layout>
          <Layout style={styles.buttonContainer}>
            <Button onPress={onContinuePress} size='large' style={styles.button}>Sign in With Apple</Button>
          </Layout>
          <Text category='p2' style={styles.disclaimer}>
            Accounts are required to give you more information about your meditations.
            We will never sell your data to anyone.
          </Text>
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

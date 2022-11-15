import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
	Button,
	Layout,
	Text,
} from '@ui-kitten/components';

import { SignInScreenNavigationProp } from '../types';

const SignInScreen = () => {
  const navigation = useNavigation<SignInScreenNavigationProp>();

  const onContinuePress = () => navigation.navigate('InitialUpload');

	return (
    <Layout style={styles.rootContainer}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.topContainer}>
          <Layout style={styles.imgPlaceholder}/>
        </Layout>
        <></>
        <Layout style={styles.bottomContainer}>
          <Button onPress={onContinuePress} style={styles.button}>Sign In With Google</Button>
          <Button onPress={onContinuePress} style={styles.button}>Sign in With Apple</Button>
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
		flex: 3,
		justifyContent: 'center',
		alignItems: 'center',
	},
	button: {
    marginVertical: 12,
		width: 200
	},
  imgPlaceholder: {
    height: 300,
    width: 300,
    backgroundColor: 'gray',
  },
  rootContainer: {
    flex: 1,
    padding: 20,
  },
});

export default SignInScreen;

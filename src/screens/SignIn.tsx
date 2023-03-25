import React from 'react';
import { Image, Platform, SafeAreaView, StyleSheet } from 'react-native';
import {
	Layout,
	Text,
  useStyleSheet,
} from '@ui-kitten/components';

import AppleSSOButton from '../components/AppleSSOButton';
import GoogleSSOButton from '../components/GoogleSSOButton';

const SignInScreen = () => {
  const styles = useStyleSheet(themedStyles);

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
                ? <AppleSSOButton />
                : null
              }
              <GoogleSSOButton/>
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

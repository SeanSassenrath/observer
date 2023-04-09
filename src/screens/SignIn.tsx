import React from 'react';
import { Image, Linking, Platform, Pressable, SafeAreaView, StyleSheet } from 'react-native';
import {
	Layout,
	Text,
  useStyleSheet,
} from '@ui-kitten/components';

import AppleSSOButton from '../components/AppleSSOButton';
import GoogleSSOButton from '../components/GoogleSSOButton';

const privacyPolicyUrl = 'https://www.privacypolicies.com/live/0f561bf7-489c-4c02-830e-c8b276e128f9';

const SignInScreen = () => {
  const styles = useStyleSheet(themedStyles);

  const onPrivacyPolicyPress = async () => {
    await Linking.openURL(privacyPolicyUrl);
  }

  return (
    <Layout level='4' style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout level='4' style={styles.contentContainer}>
          <Layout level='4' style={styles.headerContainer}>
            <Layout level='4'style={styles.headerImageBackground}>
              <Image
                source={require('../assets/app-icon.png')}
                style={imageStyles.headerImage}
              />
            </Layout>
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
          <Pressable onPress={onPrivacyPolicyPress}>
            <Text style={styles.privacyPolicy} category='s2'>Privacy Policy</Text>
          </Pressable>
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
  headerImageBackground: {
    backgroundColor: 'transparent',
    shadowColor: 'rgba(160, 139, 247, 1)',
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  heroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 7,
  },
  privacyPolicy: {
    textAlign: 'center',
    textDecorationLine: 'underline',
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

import React from 'react';
import { ImageBackground, SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { Layout, Text } from '@ui-kitten/components/ui';

import Button from '../components/Button';
import { WelcomeScreenNavigationProp } from '../types';

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  const onStartPress= () => navigation.navigate('SignIn');

  return (
    <Layout style={styles.rootContainer}>
      <SafeAreaView style={styles.container}>
        <ImageBackground source={require('../assets/stars.png')} style={styles.container}>
          <LinearGradient colors={['rgba(34, 43, 69, 0)', 'rgba(34, 43, 69, 1)']} style={styles.imgContainer}>
            <Layout style={styles.imgContainer}>
            </Layout>
          </LinearGradient>
          <Layout style={styles.textContainer}>
            <Text category='h4' style={styles.textHeader}>Welcome</Text>
            <Text category='s1' style={styles.textDescription}>
              This experience was made with love for you, the quantum observer.
              Our hope is that this app will help you with your practice, give you insights into your meditations, and continue your learning.
              We're excited and honored to be a part of your journey.
            </Text>
          </Layout>
          <Layout style={styles.bottomContainer}>
            <Button size='large' onPress={onStartPress}>
              GET STARTED
            </Button>
          </Layout>
        </ImageBackground>
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create ({
  bottomContainer: {
    flex: 1,
    paddingBottom: 20
  },
  container: {
    flex: 1,
  },
  imgContainer: {
    flex: 6,
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
  },
  textHeader: {
    marginBottom: 10,
  },
  textDescription: {
    lineHeight: 23
  },
})

export default WelcomeScreen;

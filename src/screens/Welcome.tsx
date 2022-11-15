import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Layout, Text } from '@ui-kitten/components/ui';

import { WelcomeScreenNavigationProp } from '../types';

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  const onStartPress= () => navigation.navigate('SignIn');

  return (
    <Layout style={styles.rootContainer}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.imgContainer}>
          <Layout style={styles.imgPlaceholder} />
        </Layout>
        <Layout style={styles.textContainer}>
          <Text category='h4' style={styles.textHeader}>Welcome, Sean</Text>
          <Text style={styles.textDescription}>
            This experience was made with love for you, the quantum observer.
            Our hope is that this app will help you with your practice, give you insights into your meditations, and continue your learning.
            We're excited and honored to be a part of your journey.
          </Text>
        </Layout>
        <Layout style={styles.bottomContainer}>
          <Button onPress={onStartPress}>
            GET STARTED
          </Button>
        </Layout>
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create ({
  bottomContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  imgContainer: {
    flex: 6,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
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

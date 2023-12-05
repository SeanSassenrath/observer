import {Layout, Text, useStyleSheet} from '@ui-kitten/components';
import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';

import UserContext from '../contexts/userData';

export const Inspiration = () => {
  const {user} = useContext(UserContext);
  const styles = useStyleSheet(themedStyles);

  return (
    <Layout level="2" style={styles.container}>
      <Text category="h5" style={styles.header}>
        Hello, {user.profile.firstName}
      </Text>
      <Text category="s1" style={styles.prompt}>
        Welcome to the Unlimited App! Easily find and play meditations, add
        breathwork before meditations, and gain insights into your practice.
      </Text>
    </Layout>
  );
};

const themedStyles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(48,55,75,0.6)',
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 10,
  },
  header: {
    marginBottom: 10,
    opacity: 0.9,
  },
  prompt: {
    lineHeight: 24,
    opacity: 0.7,
  },
});

import { Layout, Text, useStyleSheet } from '@ui-kitten/components';
import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';

import UserContext from '../contexts/userData';

export const Inspiration = () => {
  const { user } = useContext(UserContext);
  const styles = useStyleSheet(themedStyles);

  return (
    <Layout level='2' style={styles.container}>
      <Text category='h5' style={styles.header}>Hello, {user.profile.firstName}</Text>
      <Text category='s1' style={styles.prompt}>Remember, where you place your attention is where you place your energy.</Text>
    </Layout>
  )
}

const themedStyles = StyleSheet.create({
  container: {
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
})
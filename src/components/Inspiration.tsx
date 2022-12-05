import { Layout, Text, useStyleSheet } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet } from 'react-native';

export const Inspiration = () => {
  const styles = useStyleSheet(themedStyles);

  return (
    <Layout level='2' style={styles.container}>
      <Text category='h5' style={styles.header}>Good morning, Sean</Text>
      <Text category='s1' style={styles.prompt}>Where will you place your energy today?</Text>
    </Layout>
  )
}

const themedStyles = StyleSheet.create({
  container: {
    // backgroundColor: 'color-primary-800',
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 60,
    borderRadius: 10,
    // opacity: 0.9
  },
  header: {
    marginBottom: 10,
    // opacity: 0.9,
  },
  prompt: {
    opacity: 0.7,
  },
})
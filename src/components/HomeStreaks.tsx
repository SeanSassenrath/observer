import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';

export const HomeStreaks = () => (
  <Layout>
    <Text category='s1' style={styles.header}>Streaks</Text>
    <Layout level='2' style={styles.streakCardContainer}>
      <Layout level='2'>
        <Text category='s2' style={styles.streakCardHeader}>Current</Text>
        <Layout level='2'>
          <Text category='h5' style={styles.streakCardCount}>8</Text>
        </Layout>
        <Text category='s2' style={styles.streakCardHeader}>Days</Text>
      </Layout>
      <Layout style={styles.streakCardDivider} />
      <Layout level='2'>
        <Text category='s2' style={styles.streakCardHeader}>Longest</Text>
        <Layout level='2'>
          <Text category='h5' style={styles.streakCardCount}>43</Text>
        </Layout>
        <Text category='s2' style={styles.streakCardHeader}>Days</Text>
      </Layout>
    </Layout>
  </Layout>
)

const styles = StyleSheet.create({
  header: {
    opacity: 0.8,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  streakCardContainer: {
    flexDirection: 'row',
    marginBottom: 60,
    justifyContent: 'space-around',
    marginHorizontal: 20,
    borderRadius: 10,
  },
  streakCardHeader: {
    opacity: 0.3,
    padding: 10,
    textAlign: 'center',
  },
  streakCardCount: {
    textAlign: 'center',
  },
  streakCardDivider: {
    backgroundColor: '#ffffff',
    borderRadius: 50,
    marginVertical: 20,
    width: 1,
    opacity: 0.3,
  },
})

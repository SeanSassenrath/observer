import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text, useStyleSheet } from '@ui-kitten/components';

export const HomeStreaks = () => {
  const styles = useStyleSheet(themedStyles);

  return (
    <Layout level='4'>
      <Text category='h6' style={styles.header}>Streaks</Text>
      <Layout level='2' style={styles.streakCardContainer}>
        <Layout level='2'>
          <Text category='s2' style={styles.streakCardHeader}>Current</Text>
          <Layout level='2'>
            <Text category='h5' style={styles.streakCardCountStart}>8</Text>
          </Layout>
          <Text category='s2' style={styles.streakCardHeader}>Days</Text>
        </Layout>
        <Layout style={styles.streakCardDivider} />
        <Layout level='2'>
          <Text category='s2' style={styles.streakCardHeader}>Longest</Text>
          <Layout level='2'>
            <Text category='h5' style={styles.streakCardCountEnd}>43</Text>
          </Layout>
          <Text category='s2' style={styles.streakCardHeader}>Days</Text>
        </Layout>
      </Layout>
    </Layout>
  )
}

const themedStyles = StyleSheet.create({
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
    // opacity: 0.3,
    padding: 10,
    textAlign: 'center',
  },
  streakCardCountStart: {
    color: 'color-primary-200',
    textAlign: 'center',
  },
  streakCardCountEnd: {
    color: 'color-primary-300',
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

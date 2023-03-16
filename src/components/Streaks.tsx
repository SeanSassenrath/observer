import { Layout, Text, useStyleSheet } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet } from 'react-native';

interface StreaksProps {
  current?: number,
  longest?: number,
}

export const Streaks = ({ current, longest }: StreaksProps) => {
  const styles = useStyleSheet(themedStyles);
  const longestStreakContainerStyles = current === longest
    ? styles.currentLongestStreakContainer
    : styles.longestStreakContainer
  const currentDay = current === 1 ? 'Day' : 'Days'
  const longestDay = longest === 1 ? 'Day' : 'Days'

  return (
    <Layout level='4'>
      <Text category='h6' style={styles.header}>Streaks</Text>
      <Layout level='2' style={styles.container}>
        <Layout level='2' style={styles.currentStreakContainer}>
          <Text category='h6' style={styles.streakText}>{current || 0} {currentDay}</Text>
          <Text category='s2' style={styles.currentStreakText}>Current Streak</Text>
        </Layout>
        <Layout level='2' style={longestStreakContainerStyles}>
          <Text category='h6' style={styles.streakText}>{longest || 0} {longestDay}</Text>
          <Text category='s2' style={styles.longestStreakText}>Longest Streak</Text>
        </Layout>
      </Layout>
    </Layout>
  )
}

const themedStyles = StyleSheet.create({
  currentStreakText: {
    marginTop: 4,
    color: 'color-primary-300',
    textAlign: 'center',
  },
  currentLongestStreakContainer: {
    borderLeftWidth: 1,
    borderColor: 'gray',
    opacity: 0.9,
    padding: 20,
    flex: 1,
  },
  container: {
    paddingVertical: 18,
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 10,
    flexDirection: 'row',
  },
  currentStreakContainer: {
    borderRightWidth: 1,
    borderColor: 'gray',
    opacity: 0.9,
    padding: 20,
    flex: 1,
  },
  header: {
    opacity: 0.8,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  longestStreakContainer: {
    borderRightWidth: 1,
    borderColor: 'color-success-400',
    opacity: 0.5,
    padding: 20,
    width: 140,
  },
  longestStreakText: {
    marginTop: 4,
    color: 'color-warning-300',
    textAlign: 'center',
  },
  streakText: {
    textAlign: 'center',
  },
})
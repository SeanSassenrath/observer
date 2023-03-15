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
    ? styles.activeLongestStreakContainer
    : styles.longestStreakContainer
  const activeDay = current === 1 ? 'Day' : 'Days'
  const longestDay = longest === 1 ? 'Day' : 'Days'

  return (
    <Layout level='4'>
      <Text category='h6' style={styles.header}>Streaks</Text>
      <Layout level='2' style={styles.container}>
        <Layout level='2' style={styles.currentStreakContainer}>
          <Layout level='2'>
            <Text category='h6' style={styles.streakText}>{current || 0} {activeDay}</Text>
            <Text category='s2' style={styles.activeStreakText}>Active Streak</Text>
          </Layout>
        </Layout>
        <Layout level='2'>
          <Layout level='2' style={longestStreakContainerStyles}>
            <Text category='h6' style={styles.streakText}>{longest || 0} {longestDay}</Text>
            <Text category='s2' style={styles.longestStreakText}>Longest Streak</Text>
          </Layout>
        </Layout>
      </Layout>
    </Layout>
  )
}

const themedStyles = StyleSheet.create({
  activeStreakText: {
    marginTop: 4,
    color: 'color-primary-300',
    textAlign: 'center',
  },
  activeLongestStreakContainer: {
    borderWidth: 2,
    borderRadius: 16,
    borderColor: 'color-success-400',
    opacity: 0.9,
    padding: 20,
    width: 140,
  },
  container: {
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  currentStreakContainer: {
    borderWidth: 2,
    borderRadius: 16,
    borderColor: 'color-primary-400',
    opacity: 0.9,
    padding: 20,
    width: 140,
  },
  header: {
    opacity: 0.8,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  longestStreakContainer: {
    borderWidth: 2,
    borderRadius: 16,
    borderColor: 'color-success-400',
    opacity: 0.5,
    padding: 20,
    width: 140,
  },
  longestStreakText: {
    marginTop: 4,
    color: 'color-success-400',
    textAlign: 'center',
  },
  streakText: {
    textAlign: 'center',
  },
})
import { Layout, Text, useStyleSheet } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet } from 'react-native';

interface StreakUpdate {
  current?: number,
  longest?: number,
  newLongestStreak?: boolean,
}

export const StreakUpdate = ({
  current,
  longest,
  newLongestStreak,
}: StreakUpdate) => {
  const styles = useStyleSheet(themedStyles);
  const activeDay = current === 1 ? 'Day' : 'Days'
  const longestDay = longest === 1 ? 'Day' : 'Days'

  return (
    <Layout level='4'>
      {newLongestStreak
        ? <Layout level='2' style={styles.longestStreakContainer}> 
            <Layout level='2'>
            <Text category='h6' style={styles.streakText}>{longest || 0} {longestDay}</Text>
              <Text category='s2' style={styles.longestStreakText}>Longest Streak Updated!</Text>
            </Layout>
          </Layout>
        : <Layout level='2' style={styles.activeStreakContainer}> 
            <Layout level='2'>
              <Text category='h6' style={styles.streakText}>{current || 0} {activeDay}</Text>
              <Text category='s2' style={styles.activeStreakText}>Active Streak Updated!</Text>
            </Layout>
          </Layout>
      }
    </Layout>
  )
}

const themedStyles = StyleSheet.create({
  activeStreakContainer: {
    borderWidth: 2,
    borderColor: 'color-primary-300',
    padding: 18,
    marginBottom: 60,
    borderRadius: 10,
  },
  activeStreakText: {
    marginTop: 4,
    color: 'color-primary-300',
    textAlign: 'center',
  },
  longestStreakContainer: {
    borderWidth: 2,
    borderColor: 'color-success-400',
    padding: 18,
    marginBottom: 60,
    borderRadius: 10,
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
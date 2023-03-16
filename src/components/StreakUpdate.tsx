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

  return (
    <Layout level='4'>
      <Layout level='2' style={styles.currentStreakContainer}> 
        <Layout level='2'>
          <Text category='h6' style={styles.streakText}>{current || 0} {activeDay}!</Text>
          <Text category='s2' style={styles.currentStreakText}>Current Streak</Text>
        </Layout>
      </Layout>
    </Layout>
  )
}

const themedStyles = StyleSheet.create({
  currentStreakContainer: {
    borderWidth: 1,
    borderColor: 'color-primary-300',
    padding: 18,
    marginTop: 20,
    borderRadius: 10,
  },
  currentStreakText: {
    marginTop: 4,
    color: 'color-primary-300',
    textAlign: 'center',
  },
  longestStreakContainer: {
    borderWidth: 2,
    borderColor: 'color-warning-400',
    padding: 18,
    marginBottom: 60,
    borderRadius: 10,
  },
  longestStreakText: {
    marginTop: 4,
    color: 'color-warning-400',
    textAlign: 'center',
  },
  streakText: {
    textAlign: 'center',
  },
})
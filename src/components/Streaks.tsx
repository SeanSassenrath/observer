import {Layout, Text, useStyleSheet} from '@ui-kitten/components';
import React from 'react';
import {StyleSheet} from 'react-native';

interface StreaksProps {
  current?: number;
  longest?: number;
}

export const Streaks = ({current, longest}: StreaksProps) => {
  const styles = useStyleSheet(themedStyles);
  const longestStreakContainerStyles =
    current === longest
      ? styles.currentLongestStreakContainer
      : styles.longestStreakContainer;
  const currentDay = current === 1 ? 'Day' : 'Days';
  const longestDay = longest === 1 ? 'Day' : 'Days';

  return (
    <Layout style={styles.rootContainer}>
      <Text category="h6" style={styles.header}>
        Streaks
      </Text>
      <Layout style={styles.container}>
        <Layout style={styles.currentStreakContainer}>
          <Text category="h6" style={styles.streakText}>
            {current || 0} {currentDay}
          </Text>
          <Text category="s2" style={styles.currentStreakText}>
            Current Streak
          </Text>
        </Layout>
        <Layout style={longestStreakContainerStyles}>
          <Text category="h6" style={styles.streakText}>
            {longest || 0} {longestDay}
          </Text>
          <Text category="s2" style={styles.longestStreakText}>
            Longest Streak
          </Text>
        </Layout>
      </Layout>
    </Layout>
  );
};

const themedStyles = StyleSheet.create({
  currentStreakText: {
    marginTop: 4,
    color: 'color-primary-300',
    textAlign: 'center',
  },
  currentLongestStreakContainer: {
    backgroundColor: 'transparent',
    borderLeftWidth: 1,
    borderColor: 'gray',
    opacity: 0.9,
    padding: 20,
    flex: 1,
  },
  container: {
    backgroundColor: 'rgba(48,55,75, 0.6)',
    paddingVertical: 18,
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 10,
    flexDirection: 'row',
  },
  currentStreakContainer: {
    backgroundColor: 'transparent',
    borderRightWidth: 1,
    borderColor: 'rgb(17, 20, 37)',
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
    backgroundColor: 'transparent',

    borderLeftWidth: 1,
    borderColor: 'rgb(17, 20, 37)',
    opacity: 0.5,
    padding: 20,
    width: 140,
    flex: 1,
  },
  longestStreakText: {
    marginTop: 4,
    color: 'color-warning-300',
    textAlign: 'center',
  },
  rootContainer: {
    backgroundColor: 'transparent',
  },
  streakText: {
    textAlign: 'center',
  },
});

import {Layout, Text, useStyleSheet} from '@ui-kitten/components';
import React from 'react';
import {StyleSheet} from 'react-native';

interface TotalProps {
  totalMedCount?: number;
  totalTimeCount?: string;
}

export const TotalOverviewComponent = (props: TotalProps) => {
  const {totalMedCount, totalTimeCount} = props;
  const styles = useStyleSheet(themedStyles);

  return (
    <Layout style={styles.rootContainer}>
      <Text category="h6" style={styles.header}>
        Totals
      </Text>
      <Layout style={styles.container}>
        <Layout style={styles.columnContainer}>
          <Text category="h5" style={styles.text}>
            {totalMedCount}
          </Text>
          <Text category="s2" style={styles.subText}>
            Total Meditations
          </Text>
        </Layout>
        <Layout style={styles.columnContainer}>
          <Text category="h5" style={styles.text}>
            {totalTimeCount}
          </Text>
          <Text category="s2" style={styles.subText}>
            Total Time
          </Text>
        </Layout>
      </Layout>
    </Layout>
  );
};

const themedStyles = StyleSheet.create({
  subText: {
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
    marginBottom: 60,
    borderRadius: 10,
    flexDirection: 'row',
  },
  columnContainer: {
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
  rootContainer: {
    backgroundColor: 'transparent',
  },
  text: {
    marginTop: 4,
    textAlign: 'center',
  },
});

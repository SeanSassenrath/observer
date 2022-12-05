import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text, useStyleSheet } from '@ui-kitten/components';

export const MeditationTimeLog = () => {
  const styles = useStyleSheet(themedStyles);

  return (
    <Layout level='4'>
      <Text category='h6' style={styles.header}>Time Meditated</Text>
      <Layout level='2' style={styles.timeContainer}>
        <Layout level='2' style={styles.timeAmountContainer}>
          <Text category='s1' style={styles.timePeriod}>Week</Text>
          <Layout/>
          <Text category='h5' style={styles.timeAmountStart}>3</Text>
          <Text category='s2' style={styles.timeAmount}>Hours</Text>
        </Layout>
        <Layout level='2' style={styles.timeAmountContainer}>
          <Text category='s1' style={styles.timePeriod}>Month</Text>
          <Layout/>
          <Text category='h5' style={styles.timeAmountMiddle}>11</Text>
          <Text category='s2' style={styles.timeAmount}>Days</Text>
        </Layout>
        <Layout level='2' style={styles.timeAmountContainer}>
          <Text category='s1' style={styles.timePeriod}>Year</Text>
          <Layout/>
          <Text category='h5' style={styles.timeAmountEnd}>145</Text>
          <Text category='s2' style={styles.timeAmount}>Days</Text>
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
  timeContainer: {
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 60,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeAmountContainer: {
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeAmount: {
    marginTop: 16,
  },
  timeAmountStart: {
    color: 'color-primary-100',
    marginTop: 16,
  },
  timeAmountMiddle: {
    color: 'color-primary-200',
    marginTop: 16,
  },
  timeAmountEnd: {
    color: 'color-primary-300',
    marginTop: 16,
  },
  timePeriod: {

  }
})

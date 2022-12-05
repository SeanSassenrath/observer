import { Layout, Text, useStyleSheet } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet } from 'react-native';

export const TopMeditations = () => {
  const styles = useStyleSheet(themedStyles);

  return (
    <Layout level='4'>
      <Text category='h6' style={styles.header}>Top Meditations</Text>
      <Layout level='2' style={styles.container}>
        <Layout level='2' style={styles.topMeditationContainer}>
          <Text category='h6' style={styles.topMeditationAmountStart}>143</Text>
          <Text category='s1'>Tuning Into New Potentials</Text>
        </Layout>
        <Layout level='2' style={styles.topMeditationContainer}>
          <Text category='h6' style={styles.topMeditationAmountMiddle}>56</Text>
          <Text category='s1'>Breaking The Habit Of Being Yourself</Text>
        </Layout>
        <Layout level='2' style={styles.topMeditationContainer}>
          <Text category='h6' style={styles.topMeditationAmountEnd}>23</Text>
          <Text category='s1'>Blessing Of The Energy Centers IV</Text>
        </Layout>
      </Layout>
    </Layout>
  )
}

const themedStyles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 60,
    padding: 18,
  },
  header: {
    opacity: 0.8,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  topMeditationAmountStart: {
    color: 'color-primary-300',
    width: 50,
  },
  topMeditationAmountMiddle: {
    color: 'color-primary-200',
    width: 50,
  },
  topMeditationAmountEnd: {
    color: 'color-primary-100',
    width: 50,
  },
  topMeditationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 8,
  },
  topMeditationName: {

  }
})
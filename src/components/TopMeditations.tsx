import React from 'react';
import { StyleSheet } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { Layout, Text, useStyleSheet } from '@ui-kitten/components';

export const TopMeditations = () => {
  const styles = useStyleSheet(themedStyles);
  const widthAndHeight = 200
  const series = [23, 56, 143]
  const sliceColor = ['#DFA3F3', '#BB6FDD', '#9147BB']

  return (
    <Layout level='4'>
      <Text category='h6' style={styles.header}>Top Meditations</Text>
      <Layout level='2' style={styles.container}>
        <Layout level='2' style={styles.chartContainer}>
          <PieChart
            widthAndHeight={widthAndHeight}
            series={series}
            sliceColor={sliceColor}
            doughnut={true}
            coverRadius={0.45}
            coverFill={'rgb(27, 33, 54)'}
          />
        </Layout>
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
  chartContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },
  header: {
    opacity: 0.8,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  topMeditationAmountStart: {
    color: 'color-primary-400',
    width: 50,
  },
  topMeditationAmountMiddle: {
    color: 'color-primary-300',
    width: 50,
  },
  topMeditationAmountEnd: {
    color: 'color-primary-200',
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
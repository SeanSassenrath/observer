import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { sortBy } from 'lodash';
import { Layout, Text, useStyleSheet } from '@ui-kitten/components';

import UserContext from '../contexts/userData';

export const TopMeditations = () => {
  const { user } = useContext(UserContext)
  const styles = useStyleSheet(themedStyles);

  const meditationInstanceCounts = user
    && user.meditationUserData
    && user.meditationUserData.meditationCounts;
  const sortedMeditationInstanceCounts = sortBy(meditationInstanceCounts);
  const series = sortedMeditationInstanceCounts.map(instance => instance.count);
  console.log('INSIGHTS: sortedMeditationInstanceCounts', sortedMeditationInstanceCounts[0].count);
  const widthAndHeight = 200
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
        <Layout level='2'>
          {sortedMeditationInstanceCounts
            ? sortedMeditationInstanceCounts.map((instance) =>
              <Layout
                level='2'
                style={styles.topMeditationContainer}
                key={instance.name}
              >
                <Text category='h6' style={styles.topMeditationAmountStart}>{instance.count}</Text>
                <Text category='s1' style={styles.topMeditationName}>{instance.name}</Text>
              </Layout>
            )
            : null}
        </Layout>
        {/* <Layout level='2' style={styles.topMeditationContainer}>
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
        </Layout> */}
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
    paddingRight: 6,
    flex: 1,
  }
})
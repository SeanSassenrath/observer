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
  const sortedMeditationInstanceCounts = sortBy(meditationInstanceCounts, ['count']);
  const reversedMeditationInstanceCounts = sortedMeditationInstanceCounts.reverse();
  const topThreeMeditationInstanceCounts = reversedMeditationInstanceCounts.slice(0, 3);
  const series = topThreeMeditationInstanceCounts.map(instance => instance.count);
  const widthAndHeight = 200
  const sliceColor = ['#9147BB', '#BB6FDD', '#DFA3F3']

  return (
    <Layout level='4'>
      <Text category='h6' style={styles.header}>Top 3 Meditations</Text>
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
            ? topThreeMeditationInstanceCounts.map((instance, index) =>
              <Layout
                level='2'
                style={styles.topMeditationContainer}
                key={instance.name}
              >
                <Text category='h6'
                style={{
                  ...styles.topMeditationAmountStart,
                  color: sliceColor[index]
                }}>
                  {instance.count}
                </Text>
                <Text category='s1' style={styles.topMeditationName}>{instance.name}</Text>
              </Layout>
            )
            : null}
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
    alignItems: 'center',
    marginVertical: 8,
  },
  topMeditationName: {
    paddingRight: 6,
    flex: 1,
  }
})
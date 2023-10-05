import React from 'react';
import {StyleSheet} from 'react-native';
import PieChart from 'react-native-pie-chart';
import {sortBy} from 'lodash';
import {Layout, Text, useStyleSheet} from '@ui-kitten/components';

import {MeditationCountsMap} from '../contexts/userData';

interface TopMeditationsProps {
  meditationCounts: MeditationCountsMap | undefined;
}

export const TopMeditations = ({meditationCounts}: TopMeditationsProps) => {
  const styles = useStyleSheet(themedStyles);

  const sortedMeditationInstanceCounts = sortBy(meditationCounts, ['count']);
  const reversedMeditationInstanceCounts =
    sortedMeditationInstanceCounts.reverse();
  const topThreeMeditationInstanceCounts =
    reversedMeditationInstanceCounts.slice(0, 3);
  const series = topThreeMeditationInstanceCounts.map(
    instance => instance.count,
  );
  const widthAndHeight = 200;
  const sliceColor = ['#9147BB', '#BB6FDD', '#DFA3F3'];

  return (
    <Layout style={styles.rootContainer}>
      <Text category="h6" style={styles.header}>
        Top 3 Meditations
      </Text>
      <Layout level="2" style={styles.container}>
        <Layout level="2" style={styles.chartContainer}>
          {series.length === 0 ? (
            <PieChart
              widthAndHeight={widthAndHeight}
              series={[1]}
              sliceColor={['white']}
              doughnut={true}
              coverRadius={0.45}
              coverFill={'rgb(27, 33, 54)'}
              style={{opacity: 0.1}}
            />
          ) : (
            <PieChart
              widthAndHeight={widthAndHeight}
              series={series}
              sliceColor={sliceColor}
              doughnut={true}
              coverRadius={0.45}
              coverFill={'rgb(27, 33, 54)'}
            />
          )}
        </Layout>
        <Layout level="2">
          {topThreeMeditationInstanceCounts.length <= 0 ? (
            <Layout level="2" style={styles.topMeditationPlaceholder}>
              <Text category="s1" style={styles.topMeditationPlaceholderText}>
                Meditate to see this update
              </Text>
            </Layout>
          ) : (
            topThreeMeditationInstanceCounts.map((instance, index) => (
              <Layout
                level="2"
                style={styles.topMeditationContainer}
                key={instance.name}>
                <Text
                  category="h6"
                  style={{
                    ...styles.topMeditationAmountStart,
                    color: sliceColor[index],
                  }}>
                  {instance.count}
                </Text>
                <Text category="s1" style={styles.topMeditationName}>
                  {instance.name}
                </Text>
              </Layout>
            ))
          )}
        </Layout>
      </Layout>
    </Layout>
  );
};

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
    paddingVertical: 10,
  },
  header: {
    opacity: 0.8,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  rootContainer: {
    backgroundColor: 'transparent',
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
  },
  topMeditationPlaceholder: {
    opacity: 0.6,
  },
  topMeditationPlaceholderText: {
    textAlign: 'center',
  },
});

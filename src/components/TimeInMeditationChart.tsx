import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {DateTime} from 'luxon';
import {Layout, Text, useStyleSheet} from '@ui-kitten/components';

import {MeditationInstance} from '../types';

const makeMeditationTimeData = (meditationHistory: MeditationInstance[]) => {
  const meditationTimeData = [0, 0, 0, 0, 0];

  const now = DateTime.now();
  const day0 = now.toLocaleString();
  const day1 = now.minus({days: 1}).toLocaleString();
  const day2 = now.minus({days: 2}).toLocaleString();
  const day3 = now.minus({days: 3}).toLocaleString();
  const day4 = now.minus({days: 4}).toLocaleString();
  const day5 = now.minus({days: 5}).toLocaleString();

  meditationHistory.forEach((meditation: MeditationInstance) => {
    if (!meditation || !meditation.meditationStartTime) {
      return;
    }
    const dt = DateTime.fromSeconds(meditation.meditationStartTime);
    const meditationLocaleString = dt && dt.toLocaleString();

    if (!meditationLocaleString || meditationLocaleString === day5) {
      return;
    }

    if (meditationLocaleString === day0) {
      const timeMeditated = meditation.timeMeditated || 0;
      const dayCurrentTime = meditationTimeData[0];
      const dayTime = dayCurrentTime + timeMeditated;
      meditationTimeData[0] = dayTime;
    } else if (meditationLocaleString === day1) {
      const timeMeditated = meditation.timeMeditated || 0;
      const dayCurrentTime = meditationTimeData[1];
      const dayTime = dayCurrentTime + timeMeditated;
      meditationTimeData[1] = dayTime;
    } else if (meditationLocaleString === day2) {
      const timeMeditated = meditation.timeMeditated || 0;
      const dayCurrentTime = meditationTimeData[2];
      const dayTime = dayCurrentTime + timeMeditated;
      meditationTimeData[2] = dayTime;
    } else if (meditationLocaleString === day3) {
      const timeMeditated = meditation.timeMeditated || 0;
      const dayCurrentTime = meditationTimeData[3];
      const dayTime = dayCurrentTime + timeMeditated;
      meditationTimeData[3] = dayTime;
    } else if (meditationLocaleString === day4) {
      const timeMeditated = meditation.timeMeditated || 0;
      const dayCurrentTime = meditationTimeData[4];
      const dayTime = dayCurrentTime + timeMeditated;
      meditationTimeData[4] = dayTime;
    }
  });

  return meditationTimeData;
};

interface TimeInMeditationChartProps {
  meditationHistory: MeditationInstance[];
  style: any;
}

export const TimeInMeditationChart = (props: TimeInMeditationChartProps) => {
  const styles = useStyleSheet(themedStyles);

  const meditationTimeData = makeMeditationTimeData(props.meditationHistory);

  const now = DateTime.now();
  const day0 = now.toLocaleString({weekday: 'short'});
  const day1 = now.minus({days: 1}).toLocaleString({weekday: 'short'});
  const day2 = now.minus({days: 2}).toLocaleString({weekday: 'short'});
  const day3 = now.minus({days: 3}).toLocaleString({weekday: 'short'});
  const day4 = now.minus({days: 4}).toLocaleString({weekday: 'short'});

  const data = {
    labels: [day4, day3, day2, day1, day0],
    datasets: [
      {
        data: meditationTimeData.reverse().map(seconds => seconds / 60),
        color: (opacity = 1) => `rgba(145,71,187, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Minutes'],
  };

  const chartConfig = {
    backgroundGradientFrom: 'rgba(48,55,75,0.6)',
    backgroundGradientFromOpacity: 0.6,
    backgroundGradientTo: 'rgba(48,55,75,0.6)',
    backgroundGradientToOpacity: 0.6,
    color: (opacity = 1) => `rgba(225, 225, 225, ${opacity})`,
    decimalPlaces: 0,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const screenWidth = Dimensions.get('window').width - 40;

  return (
    <Layout style={props.style}>
      <Text category="h6" style={styles.header}>
        Time in Meditation
      </Text>
      <Layout style={styles.chartContainer}>
        <LineChart
          data={data}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          fromZero
          style={LineChartStyles.default}
        />
      </Layout>
    </Layout>
  );
};

const LineChartStyles = StyleSheet.create({
  default: {
    borderRadius: 16,
    marginHorizontal: 20,
  },
});

const themedStyles = StyleSheet.create({
  chartContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 60,
    borderRadius: 10,
    paddingVertical: 10,
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
  },
});

import React, { useContext } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import {
  LineChart,
} from 'react-native-chart-kit'
import { DateTime } from 'luxon';
import { Layout, Text, useStyleSheet } from '@ui-kitten/components';

import { MeditationInstance } from '../types';

const makeMeditationTimeData = (meditationHistory: MeditationInstance[]) => {
  const meditationTimeData = [0, 0, 0, 0, 0];

  const dt = DateTime.now();
  const day0 = dt.toLocaleString();
  const day1 = dt.minus({ days: 1 }).toLocaleString();
  const day2 = dt.minus({ days: 2 }).toLocaleString();
  const day3 = dt.minus({ days: 3 }).toLocaleString();
  const day4 = dt.minus({ days: 4 }).toLocaleString();
  const day5 = dt.minus({ days: 5 }).toLocaleString();

  meditationHistory.forEach((meditation: MeditationInstance) => {
    if (!meditation || !meditation.meditationStartTime) {
      return;
    }
    const dt = DateTime.fromSeconds(meditation.meditationStartTime);
    const meditationLocaleString = dt && dt.toLocaleString();

    if (
      !meditationLocaleString ||
      meditationLocaleString === day5
    ) {
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
  })

  return meditationTimeData;
}

interface TimeInMeditationChartProps {
  meditationHistory: MeditationInstance[],
  style: any,
}

export const TimeInMeditationChart = (props: TimeInMeditationChartProps) => {
  const styles = useStyleSheet(themedStyles);
  
  const meditationTimeData = makeMeditationTimeData(props.meditationHistory);

  const day0 = DateTime.now();
  const day1 = day0.minus({ days: 1 });
  const day2 = day0.minus({ days: 2 });
  const day3 = day0.minus({ days: 3 });
  const day4 = day0.minus({ days: 4 });

  const data = {
    labels: [day4.weekdayShort, day3.weekdayShort, day2.weekdayShort, day1.weekdayShort, day0.weekdayShort],
    datasets: [
      {
        // data: meditationTimeData.reverse().map((seconds) => seconds / 60),
        data: [47, 72, 72, 31, 24],
        color: (opacity = 1) => `rgba(119,205,72, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["Minutes"]
  };

  const chartConfig = {
    backgroundGradientFrom: "rgba(26, 33, 56, 1)",
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: "rgba(26, 33, 56, 1)",
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(225, 225, 225, ${opacity})`,
    decimalPlaces: 0,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const screenWidth = Dimensions.get("window").width-40;

  return (
    <Layout level='4' style={props.style}>
      <Text category='h6' style={styles.header}>Time in Meditation</Text>
        <Layout level='2' style={styles.chartContainer}>
          <LineChart
            data={data}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            fromZero
            style={{
              borderRadius: 16,
              marginHorizontal: 20,
            }}
          />
        </Layout>
    </Layout>
  )
}

const themedStyles = StyleSheet.create({
  chartContainer: {
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
  }
})
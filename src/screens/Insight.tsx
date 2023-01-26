import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Avatar, Card, Layout, List, Text, useStyleSheet } from '@ui-kitten/components';

import { HomeStreaks } from '../components/HomeStreaks';
import { MeditationTimeLog } from '../components/MeditationTimeLog';
import { TopMeditations } from '../components/TopMeditations';
import { MeditationHistory } from '../components/MeditationHistory';

const InsightScreen = () => {
  const styles = useStyleSheet(themedStyles);

  const renderListItem = ({ item, index }: any) => {
    const level = index % 2 ? '2' : '4';

    return (
      <Layout style={styles.listItem} level={level}>
        <Layout level={level} style={styles.listItemDataContainer}>
          <Layout level={level}>
            <Text category='s1' style={styles.listItemText}>{item.date}</Text>
            {/* <Text category='s2' style={styles.listItemText}>{item.time}</Text> */}
            <Text category='s2' style={styles.listItemText}>{item.name}</Text>
          </Layout>
          <Layout level={level}>
            <Layout style={styles.listItemIndicator}/>
          </Layout>
        </Layout>
      </Layout>
    )
  }

  return (
    <Layout style={styles.rootContainer} level='4'>
      <SafeAreaView style={styles.screenContainer}>
        <ScrollView style={styles.scrollContainer}>
            <Layout level='4' style={styles.topSpacer} />
            {/* <HomeStreaks /> */}
            {/* <MeditationTimeLog /> */}
            <TopMeditations />
            <MeditationHistory />
        </ScrollView>
      </SafeAreaView>
    </Layout>
  )
}

const themedStyles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  screenContainer: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    flex: 9,
  },
  historyHeader: {
    padding: 18,
  },
  listItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  listItemText: {
    marginVertical: 2,
  },
  listItemIndicator: {
    borderRadius: 50,
    height: 20,
    width: 20,
    backgroundColor: 'color-success-400',
  },
  listItemDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rootContainer: {
    flex: 1,
  },
  streaksCard: {
    borderRadius: 10,
    padding: 18,
  },
  streaksContainer: {
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  streaksHeader: {
    marginBottom: 10,
  },
  streaksDescription: {
    marginBottom: 8,
  },
  topSpacer: {
    margin: 30,
  },
  timeContainer: {
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeAmountContainer: {
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timePeriod: {

  },
  timeAmount: {
    marginTop: 16,
  }
})

export default InsightScreen;

import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Avatar, Card, Layout, List, Text, useStyleSheet } from '@ui-kitten/components';

import { newData } from '../constants/seedInsightsData';

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
    <Layout style={styles.rootContainer}>
      <SafeAreaView style={styles.screenContainer}>
        <Layout style={styles.headerContainer}>
          {/* <Avatar source={require('../assets/avatar.jpeg')} /> */}
        </Layout>
        <Layout style={styles.contentContainer}>
          {/* <Layout style={styles.streaksContainer}>
            <Layout level='2' style={styles.streaksCard}>
              <Text category='h6' style={styles.streaksHeader}>Streaks</Text>
              <Text style={styles.streaksDescription}>Longest Streak: 38 days</Text>
              <Text style={styles.streaksDescription}>Current Streak: 7 days</Text>
            </Layout>
          </Layout> */}
          <Layout style={styles.historyContainer}>
            <List
              data={newData}
              renderItem={renderListItem}
            />
          </Layout>
        </Layout>
        {/* <Layout style={styles.contentContainer}>
          <Layout style={styles.streaksContainer}>
            <Text category='h6' style={styles.streaksHeader}>Streaks</Text>
            <Text style={styles.streaksDescription}>Longest Streak: 38 days</Text>
            <Text style={styles.streaksDescription}>Current Streak: 7 days</Text>
          </Layout>
          <Layout>
            <Text category='h6' style={styles.historyHeader}>History</Text>
            <List
              data={newData}
              renderItem={renderListItem}
            />
          </Layout>
        </Layout> */}
      </SafeAreaView>
    </Layout>
  )
}

const themedStyles = StyleSheet.create({
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
  }
})

export default InsightScreen;

import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, List, Text, useStyleSheet } from '@ui-kitten/components';

import { newData } from '../constants/seedInsightsData';

export const MeditationHistory = () => {
  const styles = useStyleSheet(themedStyles);

  const renderListItem = ({ item, index }: any) => {
    const level = index % 2 ? '2' : '1';

    return (
      <Layout style={styles.listItem} level={level}>
        <Layout level={level} style={styles.listItemDataContainer}>
          <Text category='s2' style={styles.listItemText}>{item.date}</Text>
          <Text category='s2' style={styles.listItemText}>{item.name}</Text>
          <Layout style={styles.listItemIndicator} />
        </Layout>
      </Layout>
    )
  }

  return (
    <Layout level='4'>
      <Text category='h6' style={styles.header}>Meditation History</Text>
      <Layout style={styles.historyContainer} level='1'>
        <List
          data={newData}
          renderItem={renderListItem}
        />
      </Layout>
    </Layout>
  )
}

const themedStyles = StyleSheet.create({
  historyContainer: {
    borderRadius: 10,
    marginHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 40,
  },
  header: {
    opacity: 0.8,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  listItem: {
    paddingVertical: 20,
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
})

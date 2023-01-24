import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { DateTime } from 'luxon';
import { Layout, List, Text, useStyleSheet } from '@ui-kitten/components';

import UserContext from '../contexts/userData';
import { MeditationInstance } from '../types';

export const MeditationHistory = () => {
  const styles = useStyleSheet(themedStyles);
  const { user } = useContext(UserContext);
  const [meditationHistory, setMeditationHistory] = useState([] as MeditationInstance[])

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(user.uid)
      .collection('meditationHistory')
      .orderBy('creationTime', 'desc')
      .limit(20)
      .get()
      .then(meditationInstances => {
        console.log('INSIGHTS: Fetching meditation instances from firebase', meditationInstances);
        const docs = meditationInstances.docs;
        const meditationHistoryFromFirebase = docs.map(doc => doc.data());
        setMeditationHistory(meditationHistoryFromFirebase as MeditationInstance[]);

        console.log('meditationHistoryFromFirebase', meditationHistoryFromFirebase);
      })
  }, [])

  const renderListItem = ({ item, index }: any) => {
    const level = index % 2 ? '2' : '1';
    const date = DateTime.fromSeconds(item.creationTime.seconds)
    const displayDate = date.toLocaleString(DateTime.DATETIME_SHORT);

    return (
      <Layout style={styles.listItem} level={level} key={index}>
        <Layout level={level} style={styles.listItemDataContainer}>
          <Layout level={level}>
            <Text category='s2' style={styles.listItemText}>{item.name}</Text>
            <Text category='s2' style={styles.listItemText}>{displayDate}</Text>
          </Layout>
          <Layout style={styles.listItemIndicator} />
        </Layout>
      </Layout>
    )
  }

  return (
    <Layout level='4'>
      <Text category='h6' style={styles.header}>Meditation History</Text>
      <Layout style={styles.historyContainer} level='1'>
        {meditationHistory.map((item, index) => {
          return renderListItem({item, index})
        })}
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
    flex: 1,
    marginVertical: 6,
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

import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text, useStyleSheet } from '@ui-kitten/components';

interface StreakProps {
  styles: any,
}

const StreaksV1 = ({ styles }: StreakProps) => (
  <Layout level='4'>
    <Text category='h6' style={styles.header}>Streaks</Text>
    <Layout level='1' style={styles.streakCardContainer}>
      <Layout level='1'>
        <Text category='s2' style={styles.streakCardHeader}>Current</Text>
        <Layout level='1'>
          <Text category='h5' style={styles.streakCardCountStart}>8</Text>
        </Layout>
        <Text category='s2' style={styles.streakCardHeader}>Days</Text>
      </Layout>
      <Layout style={styles.streakCardDivider} />
      <Layout level='1'>
        <Text category='s2' style={styles.streakCardHeader}>Longest</Text>
        <Layout level='1'>
          <Text category='h5' style={styles.streakCardCountEnd}>43</Text>
        </Layout>
        <Text category='s2' style={styles.streakCardHeader}>Days</Text>
      </Layout>
    </Layout>
  </Layout>
)

const StreaksV2 = ({ styles }: StreakProps) => (
  <Layout level='4'>
    <Text category='h6' style={styles.header}>Streaks</Text>
    <Layout level='1' style={styles.streakCardContainerV2}>
      <Layout style={styles.barContainer}>
        <Layout style={styles.textContainer}>
          <Text category='s1' style={styles.text}>Current 8</Text>
          <Text category='s1' style={styles.text}>Best 59</Text>
        </Layout>
        <Layout style={styles.largestBar} />
        <Layout style={styles.currentBar}/>
      </Layout>
    </Layout>
  </Layout>
)

export const HomeStreaks = () => {
  const styles = useStyleSheet(themedStyles);

  return (
    <StreaksV2 styles={styles} />
  )
}

const themedStyles = StyleSheet.create({
  barContainer: {
    flex: 1,
  },
  currentBar: {
    backgroundColor: 'color-primary-300',
    width: 90,
    height: 30,
    borderRadius: 15,
  },
  largestBar: {
    backgroundColor: 'color-primary-600',
    height: 30,
    borderRadius: 15,
    marginBottom: -30,
    flex: 1,
  },
  header: {
    opacity: 0.8,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  streakCardContainerV2: {
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 18,
    marginHorizontal: 20,
    marginBottom: 60,
  },
  streakCardContainer: {
    flexDirection: 'row',
    marginBottom: 60,
    justifyContent: 'space-around',
    marginHorizontal: 20,
    borderRadius: 10,
  },
  streakCardHeader: {
    padding: 10,
    textAlign: 'center',
  },
  streakCardCountStart: {
    color: 'color-primary-300',
    textAlign: 'center',
  },
  streakCardCountEnd: {
    color: 'color-primary-400',
    textAlign: 'center',
  },
  streakCardDivider: {
    backgroundColor: '#ffffff',
    borderRadius: 50,
    marginVertical: 20,
    width: 1,
    opacity: 0.3,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    marginBottom: 18,
  }
})

import React from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Icon, Layout, Text } from '@ui-kitten/components';

import {
  MeditationFormattedDuration,
  MeditationId,
  MeditationName
} from '../types';

interface CardProps {
  isFirstCard?: boolean,
  formattedDuration: MeditationFormattedDuration, 
  id: MeditationId,
  level?: string,
  name: MeditationName,
}

export const CardV1 = (props: CardProps) => (
  <TouchableWithoutFeedback key={props.id}>
    <Layout
      level={props.level}
      style={styles.card}
    >
      <Layout level={props.level} style={styles.nameContainer}>
        <Text category='s1'>{props.name}</Text>
      </Layout>
      <Layout level={props.level} style={styles.formattedDurationContainer}>
        <Text category='s2'>
          {`${props.formattedDuration}m`}
        </Text>
      </Layout>
    </Layout>
  </TouchableWithoutFeedback>
)

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    flexDirection: 'row',
    height: 140,
    marginRight: 20,
    padding: 18,
    width: 200,
  },
  formattedDurationContainer: {
    alignItems: 'flex-end',
    flex: 2,
    justifyContent: 'flex-end',
  },
  nameContainer: {
    alignItems: 'flex-start',
    flex: 8,
    justifyContent: 'flex-end',
  }
})

export const CardV2 = (props: CardProps) => (
  <TouchableWithoutFeedback key={props.id}>
    <Layout
      level={props.level}
      style={stylesV2.card}
    >
      <Layout level={props.level} style={stylesV2.formattedDurationContainer}>
        <Text category='s2'>
          {`${props.formattedDuration}m`}
        </Text>
      </Layout>
      <Layout level={props.level} style={stylesV2.nameContainer}>
        <Text category='s1'>{props.name}</Text>
      </Layout>
    </Layout>
  </TouchableWithoutFeedback>
)

const stylesV2 = StyleSheet.create({
  card: {
    borderRadius: 10,
    height: 140,
    marginRight: 20,
    padding: 18,
    width: 200,
  },
  formattedDurationContainer: {
    alignItems: 'flex-end',
  },
  nameContainer: {
    justifyContent: 'flex-end',
    flex: 1,
  }
})

export const EmptyCard = () => (
  <Layout
    level='2'
    style={emptyCardStyles.card}
  >
  </Layout>
);

const emptyCardStyles = StyleSheet.create({
  card: {
    borderRadius: 10,
    height: 140,
    marginRight: 20,
    padding: 18,
    width: 200,
  },
  formattedDurationContainer: {
    alignItems: 'flex-end',
  },
  nameContainer: {
    justifyContent: 'flex-end',
    flex: 1,
  }
})

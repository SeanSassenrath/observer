import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';

import {
  MeditationFormattedDuration,
  MeditationId,
  MeditationName
} from '../types';

interface CardProps {
  color: string,
  isFirstCard?: boolean,
  formattedDuration: MeditationFormattedDuration, 
  meditationId: MeditationId,
  level?: string,
  name: MeditationName,
  onPress(id: MeditationId): void,
}

export const CardV1 = (props: CardProps) => (
  <Pressable
    key={props.meditationId}
    onPress={() => props.onPress(props.meditationId)}
  >
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
  </Pressable>
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

export const CardV3 = (props: CardProps) => (
  <Pressable onPress={() => props.onPress(props.meditationId)}>
    <Layout
      level={props.level}
      style={{ backgroundColor: props.color, ...stylesV2.card }}
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
  </Pressable>
)

export const CardV2 = (props: CardProps) => (
  <Pressable onPress={() => props.onPress(props.meditationId)}>
    <Layout
      style={{ backgroundColor: props.color, ...stylesV2.card }}
    >
      <Layout style={{ backgroundColor: props.color, ...stylesV2.formattedDurationContainer }}>
        <Text category='s2'>
          {`${props.formattedDuration}m`}
        </Text>
      </Layout>
      <Layout style={{ backgroundColor: props.color, ...stylesV2.nameContainer }}>
        <Text category='s1'>{props.name}</Text>
      </Layout>
    </Layout>
  </Pressable>
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
    style={emptyCardStyles.emptyCard}
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
  emptyCard: {
    borderRadius: 10,
    height: 140,
    marginRight: 20,
    opacity: 0.6,
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

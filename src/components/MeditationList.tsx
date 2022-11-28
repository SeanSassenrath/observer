import React from 'react';
import { ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';

import { CardV2, EmptyCard } from './Card';
import { meditationMap } from '../constants/meditation';
import { MeditationId } from '../types';

interface MeditationListProps {
  header: string,
  meditationIds: MeditationId[],
  onMeditationPress(id: MeditationId): void,
}

const EmptyList = () => (
  <>
    <EmptyCard />
    <EmptyCard />
    <EmptyCard />
    <EmptyCard />
    <EmptyCard />
  </>
)

export const MeditationList = ({
  header,
  meditationIds,
  onMeditationPress,
}: MeditationListProps) => (
  <Layout style={styles.container} key={header} level='4'>
    <Text category='h6' style={styles.header}>{header}</Text>
    <ScrollView horizontal={true} style={styles.horizontalContainer}>
      { meditationIds.length
        ? meditationIds.map((id, i) => {
          const meditation = meditationMap[id];
          return (
            <CardV2
              color={meditation.color}
              formattedDuration={meditation.formattedDuration}
              name={meditation.name}
              meditationId={meditation.meditationId}
              isFirstCard
              key={meditation.meditationId}
              level='2'
              onPress={onMeditationPress}
            />
          )
        })
        : <EmptyList />
      }
    </ScrollView>
  </Layout>
)

const styles = StyleSheet.create({
  container: {
    marginBottom: 60,
  },
  header: {
    opacity: 0.8,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  horizontalContainer: {
    paddingLeft: 20,
    paddingRight: 100,
  },
})

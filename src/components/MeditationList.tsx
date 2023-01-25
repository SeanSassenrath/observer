import React from 'react';
import { ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';

import { CardV4, EmptyCard } from './Card';
import { meditationBaseMap, meditationMap } from '../constants/meditation';
import { MeditationId } from '../types';

interface MeditationListProps {
  header: string;
  meditationBaseIds: MeditationId[];
  onMeditationPress(id: MeditationId): void;
  isMini?: boolean;
  selectedCardId?: string; 
}

interface EmptyListProps {
  isMini?: boolean;
}

const EmptyList = (props: EmptyListProps) => (
  <>
    <EmptyCard isMini={props.isMini}/>
    <EmptyCard isMini={props.isMini}/>
    <EmptyCard isMini={props.isMini}/>
    <EmptyCard isMini={props.isMini}/>
    <EmptyCard isMini={props.isMini}/>
  </>
)

export const MeditationList = ({
  header,
  meditationBaseIds,
  onMeditationPress,
  isMini,
  selectedCardId,
}: MeditationListProps) => (
  <Layout style={isMini ? styles.containerMini : styles.container} key={header} level='4'>
    <Text category='h6' style={styles.header}>{header}</Text>
    <ScrollView horizontal={true} style={styles.horizontalContainer}>
      {meditationBaseIds?.length
        ? meditationBaseIds.map((id, i) => {
          const meditation = meditationBaseMap[id];
          return (
            <CardV4
              backgroundImage={meditation.backgroundImage}
              color={meditation.color}
              formattedDuration={meditation.formattedDuration}
              name={meditation.name}
              meditationId={meditation.meditationBaseId}
              isFirstCard
              key={meditation.meditationBaseId}
              level='2'
              onPress={() => onMeditationPress(meditation.meditationBaseId)}
              isMini={isMini}
              isSelected={meditation.meditationBaseId === selectedCardId}
            />
          )
        })
        : <EmptyList isMini={isMini}/>
      }
    </ScrollView>
  </Layout>
)

const styles = StyleSheet.create({
  container: {
    marginBottom: 60,
  },
  containerMini: {
    marginBottom: 40,
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

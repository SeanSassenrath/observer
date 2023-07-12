import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Layout, Text} from '@ui-kitten/components';

import {CardV4, EmptyCard} from './Card';
import {meditationBaseMap} from '../constants/meditation-data';
import {MeditationBase, MeditationId} from '../types';
import {MeditationFilePathData} from '../utils/asyncStorageMeditation';

interface MeditationListProps {
  header: string;
  meditationBaseIds: MeditationId[];
  onMeditationPress(id: MeditationId, isDisabled?: boolean): void;
  isMini?: boolean;
  selectedCardId?: string;
  existingMeditationFilePathData?: MeditationFilePathData;
}

interface _MeditationListProps {
  header: string;
  meditationList: MeditationBase[];
  onMeditationPress(id: MeditationId, isDisabled?: boolean): void;
  isMini?: boolean;
  selectedCardId?: string;
  existingMeditationFilePathData?: MeditationFilePathData;
}

interface EmptyListProps {
  isMini?: boolean;
}

const EmptyList = (props: EmptyListProps) => (
  <>
    <EmptyCard isMini={props.isMini} />
    <EmptyCard isMini={props.isMini} />
    <EmptyCard isMini={props.isMini} />
    <EmptyCard isMini={props.isMini} />
    <EmptyCard isMini={props.isMini} />
  </>
);

export const MeditationList = ({
  header,
  meditationBaseIds,
  onMeditationPress,
  isMini,
  selectedCardId,
  existingMeditationFilePathData,
}: MeditationListProps) => {
  return (
    <Layout
      style={isMini ? styles.containerMini : styles.container}
      key={header}
      level="4">
      <Text category="h6" style={styles.header}>
        {header}
      </Text>
      <ScrollView horizontal={true} style={styles.horizontalContainer}>
        {meditationBaseIds?.length ? (
          meditationBaseIds.map(id => {
            const meditation = meditationBaseMap[id];
            const isDisabled = existingMeditationFilePathData
              ? !existingMeditationFilePathData[id]
              : false;

            return (
              <CardV4
                backgroundImage={meditation.backgroundImage}
                formattedDuration={meditation.formattedDuration}
                name={meditation.name}
                meditationId={meditation.meditationBaseId}
                isFirstCard
                key={meditation.meditationBaseId}
                level="2"
                onPress={() =>
                  onMeditationPress(meditation.meditationBaseId, isDisabled)
                }
                isMini={isMini}
                isSelected={meditation.meditationBaseId === selectedCardId}
                isDisabled={isDisabled}
              />
            );
          })
        ) : (
          <EmptyList isMini={isMini} />
        )}
      </ScrollView>
    </Layout>
  );
};

export const _MeditationListSection = (props: _MeditationListProps) => {
  const {header, isMini} = props;

  return (
    <Layout
      style={isMini ? styles.containerMini : styles.container}
      key={header}
      level="4">
      <Text category="h6" style={styles.header}>
        {header}
      </Text>
      <_MeditationList {...props} />
    </Layout>
  );
};

export const _MeditationList = (props: _MeditationListProps) => {
  const {
    meditationList,
    onMeditationPress,
    isMini,
    selectedCardId,
    existingMeditationFilePathData,
  } = props;

  return (
    <ScrollView horizontal={true} style={styles.horizontalContainer}>
      {meditationList?.length ? (
        meditationList.map(meditation => {
          const isDisabled = existingMeditationFilePathData
            ? !existingMeditationFilePathData[meditation.meditationBaseId]
            : false;

          return (
            <CardV4
              backgroundImage={meditation.backgroundImage}
              formattedDuration={meditation.formattedDuration}
              name={meditation.name}
              meditationId={meditation.meditationBaseId}
              isFirstCard
              key={meditation.meditationBaseId}
              level="2"
              onPress={() =>
                onMeditationPress(meditation.meditationBaseId, isDisabled)
              }
              isMini={isMini}
              isSelected={meditation.meditationBaseId === selectedCardId}
              isDisabled={isDisabled}
            />
          );
        })
      ) : (
        <EmptyList isMini={isMini} />
      )}
    </ScrollView>
  );
};

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
});

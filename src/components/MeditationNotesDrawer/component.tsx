import React from 'react';
import {Button, Layout, Text} from '@ui-kitten/components';
import {ModalProps, ScrollView, StyleSheet, View} from 'react-native';
import {DateTime} from 'luxon';

import {Drawer} from '../Drawer/component';
import {MeditationBase, MeditationInstance} from '../../types';

const EMPTY_STRING = '';

interface Props extends ModalProps {
  meditation?: MeditationBase;
  meditationDate?: string;
  meditationInstance?: MeditationInstance;
  showStartMeditation?: boolean;
  meditationLink?(): void;
  onClosePress(): void;
}

export const MeditationNotesDrawerComponent = (props: Props) => {
  const {
    meditation,
    meditationInstance,
    meditationLink,
    showStartMeditation,
    visible,
    onClosePress,
  } = props;

  const getDisplayDate = (item: MeditationInstance) => {
    if (item.meditationStartTime) {
      const date = DateTime.fromSeconds(item.meditationStartTime);
      return date.toLocaleString(DateTime.DATE_SHORT);
    } else {
      return EMPTY_STRING;
    }
  };

  return (
    <Drawer visible={visible} onClosePress={onClosePress}>
      <Layout level="2" style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text category="h5" style={styles.title}>
            {meditation?.name}
          </Text>
          <Text category="s1">
            {meditationInstance && getDisplayDate(meditationInstance)}
          </Text>
        </View>
        <ScrollView style={styles.scrollViewContainer}>
          <View style={styles.textSectionsContainer}>
            {meditationInstance?.intention ? (
              <View style={styles.textSection}>
                <Text category="s1" style={styles.textHeader}>
                  Intention
                </Text>
                <Text category="h6">{meditationInstance?.intention}</Text>
              </View>
            ) : null}
            {meditationInstance?.notes ? (
              <View style={styles.textSection}>
                <Text category="s1" style={styles.textHeader}>
                  What did you do well in your meditation?
                </Text>
                <Text category="h6">{meditationInstance?.notes}</Text>
              </View>
            ) : null}
            {meditationInstance?.feedback ? (
              <View style={styles.textSection}>
                <Text category="s1" style={styles.textHeader}>
                  If you had another opportunity, what would you do differently?
                </Text>
                <Text category="h6">{meditationInstance?.feedback}</Text>
              </View>
            ) : null}
            {meditationInstance?.feedback ||
            meditationInstance?.intention ||
            meditationInstance?.notes ? null : (
              <Text category="h6" style={styles.emptyNotes}>
                Add an intention, what you did well, and feedback to your
                meditations to see it in your meditation notes.
              </Text>
            )}
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonSubContainer}>
            {showStartMeditation ? (
              <Button
                size="large"
                onPress={meditationLink}
                style={styles.startButton}>
                Start Meditation
              </Button>
            ) : null}
            <Button
              appearance="ghost"
              size="large"
              status="basic"
              onPress={onClosePress}>
              Close
            </Button>
          </View>
        </View>
      </Layout>
    </Drawer>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    height: 680,
    bottom: 0,
    paddingBottom: 40,
    borderRadius: 20,
  },
  description: {
    fontWeight: 'normal',
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginVertical: 30,
  },
  textContainer: {
    padding: 20,
  },
  title: {
    marginBottom: 10,
  },
  textSectionsContainer: {
    paddingTop: 30,
  },
  textSection: {
    marginBottom: 60,
  },
  textHeader: {
    marginBottom: 10,
    opacity: 0.8,
  },
  scrollViewContainer: {
    paddingHorizontal: 20,
  },
  startButton: {
    borderRadius: 100,
    marginBottom: 10,
  },
  emptyNotes: {
    textAlign: 'center',
    lineHeight: 30,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    position: 'absolute',
    backgroundColor: 'transparent',
    width: '100%',
    bottom: 40,
  },
  bottomBarGradient: {
    height: 100,
  },
  buttonSubContainer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
});

import React from 'react';
import {Modal, Layout, Text, ModalProps, Button} from '@ui-kitten/components';
import {Image, ScrollView, StyleSheet} from 'react-native';
import {MeditationBase, MeditationInstance} from '../../types';

interface Props extends ModalProps {
  meditation?: MeditationBase;
  meditationDate?: string;
  meditationInstance?: MeditationInstance;
  showStartMeditation: boolean;
  meditationLink?(): void;
}

export const MeditationNotesModalComponent = (props: Props) => {
  const {
    visible,
    onBackdropPress,
    meditation,
    meditationInstance,
    meditationDate,
    meditationLink,
    showStartMeditation,
  } = props;

  return (
    <Modal
      visible={visible}
      onBackdropPress={onBackdropPress}
      backdropStyle={styles.backdrop}>
      <Layout level="2" style={styles.rootContainer}>
        <Layout level="2" style={styles.meditationContentContainer}>
          <Image
            source={meditation ? meditation.backgroundImage : ''}
            style={imageStyles.image}
          />
          <Layout level="2" style={styles.meditationContainer}>
            <Layout level="2" style={styles.meditationMetaDataContainer}>
              <Text category="s1" style={styles.meditationName}>
                {meditation ? meditation.name : ''}
              </Text>
              <Text category="s1">{meditationDate}</Text>
            </Layout>
          </Layout>
        </Layout>
        <ScrollView>
          <Layout level="2" style={styles.textSectionsContainer}>
            {meditationInstance?.intention ? (
              <Layout level="2" style={styles.textSection}>
                <Text category="s1" style={styles.textHeader}>
                  Intention
                </Text>
                <Text category="h6">{meditationInstance?.intention}</Text>
              </Layout>
            ) : null}
            {meditationInstance?.notes ? (
              <Layout level="2" style={styles.textSection}>
                <Text category="s1" style={styles.textHeader}>
                  What did you do well in your meditation?
                </Text>
                <Text category="h6">{meditationInstance?.notes}</Text>
              </Layout>
            ) : null}
            {meditationInstance?.feedback ? (
              <Layout level="2" style={styles.textSection}>
                <Text category="s1" style={styles.textHeader}>
                  If you had another opportunity, what would you do differently?
                </Text>
                <Text category="h6">{meditationInstance?.feedback}</Text>
              </Layout>
            ) : null}
          </Layout>
        </ScrollView>
        <Layout level="2">
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
            onPress={onBackdropPress}>
            Close
          </Button>
        </Layout>
      </Layout>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  meditationContentContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    flex: 0,
    marginBottom: 10,
  },
  meditationContainer: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'space-between',
  },
  meditationMetaDataContainer: {
    backgroundColor: 'transparent',
    marginBottom: 10,
    opacity: 0.8,
  },
  meditationName: {
    marginBottom: 4,
  },
  rootContainer: {
    borderRadius: 10,
    // height: 680,
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 30,
    width: 360,
  },
  startButton: {
    borderRadius: 100,
    marginBottom: 10,
  },
  textHeader: {
    marginBottom: 10,
    opacity: 0.8,
  },
  textSectionsContainer: {
    paddingTop: 30,
  },
  textSection: {
    marginBottom: 40,
  },
});

const imageStyles = StyleSheet.create({
  image: {
    borderRadius: 10,
    height: 80,
    marginRight: 16,
    width: 120,
    overflow: 'hidden',
  },
});

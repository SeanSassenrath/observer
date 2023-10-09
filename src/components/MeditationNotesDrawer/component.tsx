import React from 'react';
import {Button, Text} from '@ui-kitten/components';
import {
  ImageBackground,
  ModalProps,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Drawer} from '../Drawer/component';
import {MeditationBase, MeditationInstance} from '../../types';
import LinearGradient from 'react-native-linear-gradient';

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

  return (
    <Drawer visible={visible} onClosePress={onClosePress}>
      <View style={styles.contentContainer}>
        <View style={styles.imgContainer}>
          <ImageBackground
            source={meditation?.backgroundImage}
            style={styles.img}
          />
          <Text category="h5" style={styles.title}>
            {meditation?.name}
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
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <LinearGradient
            colors={['transparent', '#0B0E18', '#0B0E18']}
            style={styles.bottomBarGradient}>
            <View style={{justifyContent: 'flex-end', flex: 1}}>
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
          </LinearGradient>
        </View>
      </View>
    </Drawer>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: '#0B0E18',
    height: 680,
    bottom: 0,
    paddingBottom: 40,
  },
  description: {
    fontWeight: 'normal',
  },
  img: {
    width: '100%',
    height: 180,
    position: 'absolute',
    top: 0,
    opacity: 0.4,
  },
  imgContainer: {
    backgroundColor: 'transparent',
    height: 200,
    justifyContent: 'flex-end',
  },
  textContainer: {
    padding: 20,
  },
  title: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  textSectionsContainer: {
    paddingTop: 30,
  },
  textSection: {
    marginBottom: 40,
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
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    position: 'absolute',
    backgroundColor: 'transparent',
    width: '100%',
    bottom: 40,
  },
  bottomBarGradient: {
    height: 180,
  },
});

import React, { useContext, useState} from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components/ui';
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';

import Button from '../components/Button';
import MeditationBaseDataContext from '../contexts/meditationBaseData';
import FtuxContext from '../contexts/ftuxData';
import { onAddMeditations } from '../utils/addMeditations';
import { setFtuxStateInAsyncStorage } from '../utils/ftux';
import { MeditationFilePathData } from '../utils/asyncStorageMeditation';

//@ts-ignore
import videoFile from '../assets/app-tutorial-4-ios-select.mov';

const AddFilesTutorial3 = () => {
  const [existingMediationFilePathData, setExistingMeditationFilePathData] = useState({} as MeditationFilePathData);
  const { setMeditationBaseData } = useContext(MeditationBaseDataContext);
  const { hasSeenFtux, setHasSeenFtux } = useContext(FtuxContext);

  const navigation = useNavigation();

  const onAddMeditationsPress = async () => {
    const meditations = await onAddMeditations(
      existingMediationFilePathData,
      setExistingMeditationFilePathData,
    )
    if (meditations) {
      setMeditationBaseData(meditations);
      await setFtuxStateInAsyncStorage();
      setHasSeenFtux(true);
      onSuccessNavigation();
    }
  }

  const onSuccessNavigation = () => {
    //@ts-ignore
    navigation.navigate('TabNavigation', { screen: 'Library'});
  }

  const onContinuePress = async () => {
    await setFtuxStateInAsyncStorage();
    setHasSeenFtux(true);
    navigation.navigate('TabNavigation');
  }

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Layout style={styles.contentContainer}>
            <Layout style={styles.videoContainer}>
              <Layout style={styles.videoBackground}>
                <Video
                  source={videoFile}
                  paused={false}
                  style={{
                    height: 450,
                  }}
                  repeat={true}
                />
              </Layout>
            </Layout>
            <Layout style={styles.bottomContainer}>
              <Layout style={styles.instructions}>
                <Text category='h5' style={styles.header}>
                  {'Step 3: Add meditations to the app'}
                </Text>
                <Text category='s1' style={styles.description}>
                  {`Press the "Add Medtiations button" below > Open your "Meditations" folder > Select a meditation or "Select All" to add all meditations`}
                </Text>
              </Layout>
              <Button
                size='large'
                onPress={onAddMeditationsPress}
                style={styles.addMeditationsButton}
              >
                Add Meditations
              </Button>
              <Button
                appearance='outline'
                size='large'
                onPress={onContinuePress}
                status="basic"
              >
                Skip
              </Button>
            </Layout>
          </Layout>
        </ScrollView>
        <LinearGradient colors={['rgba(34, 43, 69, 0)', 'rgba(34, 43, 69, 1)']} style={styles.linearGradientContainer} />
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  addMeditationsButton: {
    marginBottom: 30,
  },
  bottomContainer: {
    backgroundColor: 'transparent',
    flex: 3,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: 'transparent',
    flex: 1,
    paddingBottom: 100,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  description: {
    backgroundColor: 'transparent',
    lineHeight: 20,
    paddingTop: 20,
    paddingBottom: 10,
    textAlign: 'center',
  },
  header: {
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  instructions: {
    backgroundColor: 'transparent',
    paddingVertical: 20,
  },
  linearGradientContainer: {
    bottom: 0,
    height: 150,
    position: 'absolute',
    width: '100%',
  },
  videoBackground: {
    backgroundColor: 'black',
    borderRadius: 16,
    paddingVertical: 10,
    width: 225,
  },
  videoContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flex: 7,
  }
});

export default AddFilesTutorial3;

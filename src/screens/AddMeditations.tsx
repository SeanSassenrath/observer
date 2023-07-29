import React, {useContext} from 'react';
import {Layout, Text} from '@ui-kitten/components';
import {SafeAreaView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Button from '../components/Button';
import UnsupportedFilesContext from '../contexts/unsupportedFiles';
import UserContext from '../contexts/userData';
import MeditationFilePathsContext from '../contexts/meditationFilePaths';
import {onAddMeditations} from '../utils/addMeditations';
import MeditationBaseDataContext from '../contexts/meditationBaseData';

const AddMeditationsScreen = () => {
  const {user} = useContext(UserContext);
  const {meditationFilePaths, setMeditationFilePaths} = useContext(
    MeditationFilePathsContext,
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {meditationBaseData, setMeditationBaseData} = useContext(
    MeditationBaseDataContext,
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {unsupportedFiles, setUnsupportedFiles} = useContext(
    UnsupportedFilesContext,
  );

  const navigation = useNavigation();

  const onAddMeditationsPress = async () => {
    const supportedMeditations = await onAddMeditations(
      meditationFilePaths,
      setMeditationFilePaths,
      setUnsupportedFiles,
      user,
    );

    if (supportedMeditations) {
      setMeditationBaseData(supportedMeditations);
      navigation.navigate('FixMeditation');
    }
  };

  return (
    <Layout level="4" style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout level="4" style={styles.top} />
        <Layout level="4" style={styles.middle}>
          <Text category="h3" style={styles.header}>
            Add Meditations
          </Text>
          <Text category="s1" style={styles.description}>
            Add meditations from your phone, Dropbox, Google Drive, or wherever
            you keep your meditations files.
          </Text>
        </Layout>
        <Layout level="4" style={styles.bottom}>
          <Button
            size="large"
            onPress={onAddMeditationsPress}
            style={styles.addButton}>
            Add Meditations
          </Button>
          <Button appearance="ghost" size="large" status="basic">
            Skip
          </Button>
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  addButton: {
    color: 'white',
    marginBottom: 16,
  },
  bottom: {
    justifyContent: 'flex-end',
    flex: 2,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 20,
    textAlign: 'center',
  },
  description: {
    lineHeight: 24,
    textAlign: 'center',
  },
  middle: {
    flex: 4,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  skipButton: {
    color: 'white',
  },
  top: {
    flex: 3,
    paddingHorizontal: 20,
  },
});

export default AddMeditationsScreen;

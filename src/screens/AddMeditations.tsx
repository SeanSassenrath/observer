import React, {useContext} from 'react';
import {Button, Layout, Text} from '@ui-kitten/components';
import {SafeAreaView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

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
      navigation.navigate('AddMeditationsSummary');
    }
  };

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.top} />
        <Layout style={styles.middle}>
          <Text category="h5">Add Meditations</Text>
          <Text category="s1">
            Sub header text explaining what is going on in this screen
          </Text>
        </Layout>
        <Layout style={styles.bottom}>
          <Button size="large" onPress={onAddMeditationsPress}>
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
  },
  bottom: {
    flex: 3,
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
  },
  middle: {
    flex: 4,
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

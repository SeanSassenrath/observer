import React, {useContext} from 'react';
import {Layout, Text} from '@ui-kitten/components';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Button from '../components/Button';
import UserContext from '../contexts/userData';
import MeditationFilePathsContext from '../contexts/meditationFilePaths';
import {onAddMeditations} from '../utils/addMeditations';
import UnknownFilesContext from '../contexts/unknownFiles';

const AddMeditationsScreen = () => {
  const {user} = useContext(UserContext);
  const {meditationFilePaths, setMeditationFilePaths} = useContext(
    MeditationFilePathsContext,
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {unknownFiles, setUnknownFiles} = useContext(UnknownFilesContext);

  const navigation = useNavigation();

  const onSkipPress = () => {
    // @ts-ignore
    navigation.navigate('TabNavigation', {screen: 'Home'});
  };

  const onAddMeditationsPress = async () => {
    const {_meditations, _unknownFiles} = await onAddMeditations(
      meditationFilePaths,
      setMeditationFilePaths,
      setUnknownFiles,
      user,
    );

    navigation.navigate('AddMedsMatching', {
      medsSuccess: _meditations,
      medsFail: _unknownFiles,
    });
  };

  return (
    <Layout level="4" style={styles.rootContainer}>
      <SafeAreaView style={styles.container}>
        <View style={styles.top} />
        <View style={styles.middle}>
          <Text category="h3" style={styles.header}>
            Add Meditations
          </Text>
          <Text category="s1" style={styles.description}>
            Add meditations from your phone, Dropbox, Google Drive, or wherever
            you keep your meditations files.
          </Text>
        </View>
        <View style={styles.bottom}>
          <Button
            size="large"
            onPress={onAddMeditationsPress}
            style={styles.addButton}>
            Add Meditations
          </Button>
          <Button
            appearance="ghost"
            size="large"
            status="basic"
            onPress={onSkipPress}>
            Skip
          </Button>
        </View>
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
  rootContainer: {
    flex: 1,
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

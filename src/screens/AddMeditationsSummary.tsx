import {Button, Layout, Text} from '@ui-kitten/components';
import React, {useContext, useEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

import UnsupportedFilesContext from '../contexts/unsupportedFiles';
import MeditationFilePathsContext from '../contexts/meditationFilePaths';

const AddMeditationsSummary = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {meditationFilePaths, setMeditationFilePaths} = useContext(
    MeditationFilePathsContext,
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {unsupportedFiles, setUnsupportedFiles} = useContext(
    UnsupportedFilesContext,
  );

  useEffect(() => {
    console.log('meditationFilePaths', meditationFilePaths);
    console.log('unsupportedFiles', unsupportedFiles);
  }, []);

  const addedMeditationsCount = meditationFilePaths
    ? Object.keys(meditationFilePaths).length
    : 0;
  const failedMeditationsCount = unsupportedFiles ? unsupportedFiles.length : 0;

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.top} />
        <Layout style={styles.middle}>
          <Text>{addedMeditationsCount} Success</Text>
          <Text>{failedMeditationsCount} Failed</Text>
        </Layout>
        <Layout style={styles.bottom}>
          <Button size="large">Fix Meditations</Button>
          <Button appearance="ghost" size="large" status="basic">
            Skip
          </Button>
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  bottom: {
    flex: 2,
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
  },
  middle: {
    flex: 5,
    paddingHorizontal: 20,
  },
  top: {
    flex: 3,
    paddingHorizontal: 20,
  },
});

export default AddMeditationsSummary;

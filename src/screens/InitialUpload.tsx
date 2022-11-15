import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Layout, Text } from '@ui-kitten/components/ui';

import { InitialUploadScreenNavigationProp } from '../types';
import { pickFilesFromDevice } from '../utils/filePicker';

enum ScreenState {
  'Inital',
  'Success',
  'Fail',
  'Mixed',
}

const InitialUploadScreen = () => {
  const navigation = useNavigation<InitialUploadScreenNavigationProp>();
  const [screenState, setScreenState] = useState(ScreenState.Inital);

  const onContinuePress = () => navigation.navigate('TabNavigation');

  const onUploadPress = async () => {
    const { normalizedMeditations, unsupportedNamesList } = await pickFilesFromDevice()

    if (
      normalizedMeditations.length <= 0 &&
      unsupportedNamesList.length > 0
    ) {
      setScreenState(ScreenState.Fail);
    } else if (
      normalizedMeditations.length > 0 &&
      unsupportedNamesList.length > 0
    ) {
      // save normalizedMeditations to Async Storage
      setScreenState(ScreenState.Mixed);
    } else if (
      normalizedMeditations.length > 0 &&
      unsupportedNamesList.length <=0
    ) {
      setScreenState(ScreenState.Success);
    }
    console.log('normalized meditations', normalizedMeditations);
    console.log('unsupported files', unsupportedNamesList);
  };

  const getScreenStateContent = () => {
    switch (screenState) {
      case ScreenState.Inital:
        return {
          header: 'Upload Meditations',
          body: 'Upload meditations placeholder text. Need to figure out what this will say.',
          buttonText: 'Add Meditations',
          onPress: onUploadPress,
        };
      case ScreenState.Fail:
        return {
          header: 'Oops. Let\'s Try Again.',
          body: 'Failed upload placeholder text. Need to figure out what this will say.',
          buttonText: 'Retry',
          onPress: onUploadPress,
        };
      case ScreenState.Mixed:
        return {
          header: 'Partially Successful',
          body: 'Partially successful placeholder text. Need to figure out what this will say.',
          buttonText: 'Continue',
          onPress: onContinuePress,
        };
      case ScreenState.Success:
        return {
          header: 'Success!',
          body: 'Success placeholder text. Need to figure out what this will say.',
          buttonText: 'Continue',
          onPress: onContinuePress,
        };
    }
  }

  const screenStateContent = getScreenStateContent();

  return (
    <Layout style={styles.rootContainer}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.contentContainer}>
          <Text
            category='h5'
            style={styles.textHeader}
          >
            {screenStateContent.header}
          </Text>
          <Text>{screenStateContent.body}</Text>
        </Layout>
        <Layout style={styles.bottomContainer}>
          <Button onPress={screenStateContent.onPress}>{screenStateContent.buttonText}</Button>
        </Layout>
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  bottomContainer: {
    flex: 1,
  },
  closeIcon: {
    height: 20,
    width: 20,
  },
  closeIconContainer: {
    padding: 5,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 9,
    justifyContent: 'flex-end',
    marginBottom: 50,
  },
  modal: {
    borderRadius: 4,
    height: 250,
    width: 300,
  },
  modalBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContentContainer: {
    borderRadius: 4,
    padding: 20,
  },
  modalDescriptionText: {
    marginVertical: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rootContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  textHeader: {
    marginVertical: 16,
  }
})

export default InitialUploadScreen;

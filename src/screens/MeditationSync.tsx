import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Button, Icon, Layout, ListItem, Spinner, Text } from '@ui-kitten/components';

import { MeditationSyncScreenNavigationProp, PickedFile } from '../types';

const storageKey = '@meditation_data';

interface MeditationNameMap {
  [key: string]: string;
}

const meditationNameMap: MeditationNameMap = {
  ['01-Introduction_to_Tuning_In_to_New_Potentials.mp3']: 'Tuning Into New Potentials',
  ['02 Body Parts - Space.m4a']: 'Breaking the Habit of Being Yourself',
}

const normalizeMeditationData = (files: DocumentPickerResponse[]) => {
  const normalizedFiles: PickedFile[] = []
  files.map((file, index) => {
    if (file && file.name) {
      const normalizedFileName = meditationNameMap[file.name];
      normalizedFiles.push({ ...file, normalizedName: normalizedFileName })
    }
  })

  return normalizedFiles;
}

const CloseIcon = (props: any) => (
  <Icon {...props} name='close-outline' />
);

const SuccessIcon = (props: any) => (
  <Icon {...props} fill='#00A36C' name='checkmark-circle-2-outline' />
);

const IndeterminateIcon = (props: any) => (
  <Icon {...props} fill='#8F9BB3' name='minus-circle-outline' />
);

const renderMeditationItem = ({ item }: any) => (
  <ListItem
    accessoryLeft={SuccessIcon}
    title={item.normalizedName}
  />
)

const renderPlaceholderItem = ({ item }: any) => (
  <ListItem
    accessoryLeft={IndeterminateIcon}
    title={item.name}
  />
)

const placeholderFlatListItems = [
  {"name": "Meditation Placeholder"},
  {"name": "Meditation Placeholder"},
  {"name": "Meditation Placeholder"},
  {"name": "Meditation Placeholder"},
  {"name": "Meditation Placeholder"},
]

const MeditationSync = () => {
  const navigation = useNavigation<MeditationSyncScreenNavigationProp>();
  const [fileStored, setFiledStored] = useState(false);
  const [isPickingFiles, setIsPickingFiles] = useState(false);
  const [meditationFiles, setMeditationFiles] = useState([] as PickedFile[]);

  useEffect(() => {
    getMeditationData();
  }, [fileStored]);

  const getMeditationData = async () => {
    try {
      const jsonMeditationFiles = await AsyncStorage.getItem(storageKey)
      const meditationFiles = jsonMeditationFiles != null ? JSON.parse(jsonMeditationFiles) : null;
      console.log('Async meditation data value', meditationFiles);
      setMeditationFiles(meditationFiles)
    } catch (e) {
      console.log('error with setting meditation files', e);
    }
  }

  const onClosePress = () => {
    navigation.pop();
  }

  const handleDocumentSelection = useCallback(async () => {
    setIsPickingFiles(true);
  
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        allowMultiSelection: true,
      });
      const normalizedMeditationData = normalizeMeditationData(response)
      const stringifiedNormalizedMeditationData = JSON.stringify(normalizedMeditationData);
      if (stringifiedNormalizedMeditationData !== null && stringifiedNormalizedMeditationData !==undefined) {
        await AsyncStorage.setItem(storageKey, stringifiedNormalizedMeditationData);
        setFiledStored(true);
      }
      // setFileResponse(response);
    } catch (err) {
      console.log(err);
    }

    setTimeout(() => {
      setIsPickingFiles(false);
    }, 800);
  }, []);

  const onRemoveMeditationsPress = async () => {
    try {
      await AsyncStorage.removeItem(storageKey)
    } catch (e) {
      console.log('error removing from storage', e)
    }
  
    setMeditationFiles([])
  }

  const hasMeditationFiles = meditationFiles && !!meditationFiles.length;

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.topBar}>
          <Text category='h4' style={styles.topBarText}>Add Meditations</Text>
          <Button
            appearance='ghost'
            accessoryLeft={CloseIcon}
            onPress={onClosePress}
            style={styles.topBarIcon}
          />
        </Layout>
        <Layout style={styles.section}>
          <Text category='p1'>This is placeholder text, but we'll need to add something here.</Text>
        </Layout>
        <Layout style={styles.flatList}>
          { isPickingFiles
            ? <Layout style={styles.spinnerContainer}>
                <Spinner size='giant' />
              </Layout>
            : <FlatList
                data={meditationFiles || placeholderFlatListItems}
                renderItem={meditationFiles ? renderMeditationItem : renderPlaceholderItem}
              />
          }
          { hasMeditationFiles && !isPickingFiles
            ? <Button
                appearance='ghost'
                onPress={onRemoveMeditationsPress}
                status='basic'
              >
                Remove All Meditations
              </Button>
            : null
          }
        </Layout>
        <Layout style={styles.bottomSection}>
          <Button appearance='outline' onPress={handleDocumentSelection}>ADD MEDITATIONS</Button>
          <Button
            onPress={onClosePress}
            style={styles.addButton}
          >DONE</Button>
        </Layout>
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  addButton: {
    marginVertical: 20,
  },
  bottomSection: {
    flex: 2,
    padding: 20,
  },
  container: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    flex: 1,
  },
  spinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  flatList: {
    padding: 10,
    flex: 6,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 20,
    paddingTop: 10,
    flex: 1,
  },
  topBarText: {
    flex: 9,
  },
  topBarIcon: {
    flex: 1
  }
})

export default MeditationSync;

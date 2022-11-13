import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Icon, Layout, ListItem, Spinner, Text } from '@ui-kitten/components';

import { MeditationSyncScreenNavigationProp } from '../types';
import MeditationDataContext, { getMeditationDataFromAsyncStorage, storageKey } from '../contexts/meditationData';
import { normalizeMeditationData } from '../utils/meditation';

const CloseIcon = (props: any) => (
  <Icon {...props} name='close-outline' />
);

const SuccessIcon = (props: any) => (
  <Icon {...props} fill='#00A36C' name='checkmark-circle-2-outline' />
);

const renderMeditationItem = ({ item }: any) => (
  <ListItem
    accessoryLeft={SuccessIcon}
    title={item.name}
  />
)

const MeditationSync = () => {
  const {meditations, setMeditations} = useContext(MeditationDataContext);
  const navigation = useNavigation<MeditationSyncScreenNavigationProp>();
  const [fileStored, setFiledStored] = useState(false);
  const [isPickingFiles, setIsPickingFiles] = useState(false);

  const setMeditationsFromAsyncStorage = async () => {
    const meditationsFromAsyncStorage = await getMeditationDataFromAsyncStorage();
    setMeditations(meditationsFromAsyncStorage)
  }

  useEffect(() => {
    setMeditationsFromAsyncStorage();
  }, [fileStored]);

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
      const {normalizedMeditations, errors} = normalizeMeditationData(response)

      // join existing meditations and new medidations
      const stringifiedMeditationData = JSON.stringify(normalizedMeditations);
      if (stringifiedMeditationData !== null && stringifiedMeditationData !==undefined) {
        await AsyncStorage.setItem(storageKey, stringifiedMeditationData);
        setFiledStored(true);
      }
    } catch (err) {
      console.log(err);
    }

    setTimeout(() => {
      setIsPickingFiles(false);
    }, 600);
  }, []);

  const onRemoveMeditationsPress = async () => {
    try {
      await AsyncStorage.removeItem(storageKey)
    } catch (e) {
      console.log('error removing from storage', e)
    }
  
    setMeditations([])
  }

  const hasMeditationFiles = meditations && !!meditations.length;

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
            : hasMeditationFiles 
              ? <FlatList
                  data={meditations}
                  renderItem={renderMeditationItem}
                />
              : null
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

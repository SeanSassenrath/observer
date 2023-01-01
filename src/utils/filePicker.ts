import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from "lodash";

import { meditationMap } from '../constants/meditation';
import { storageKey } from '../contexts/meditationData';
import { MeditationId } from '../types';

export const pickFilesFromDevice = async (unlockedMeditationIds: MeditationId[] = []) => {
    try {
      const files = await DocumentPicker.pick({ allowMultiSelection: true });
      const { updatedUnlockedMeditationIds, unsupportedFileNames } = parsePickedFiles(files);

      const joinedMeditationIds: MeditationId[] = [...unlockedMeditationIds, ...updatedUnlockedMeditationIds]
      const dedupedMeditationIds = _.uniq(joinedMeditationIds);
  
      return { updatedUnlockedMeditationIds: dedupedMeditationIds, unsupportedFileNames }
    } catch(e) {
      console.log('Picking files error', e);
    }
  }

const parsePickedFiles = (files: DocumentPickerResponse[]) => {
  const updatedUnlockedMeditationIds: MeditationId[] = [];
  const unsupportedFileNames: string[] = [];
  const defaultFileName = 'Unknown';

  files.forEach(file => {
    const meditationId = file.size?.toString()
    if (meditationId && meditationMap[meditationId]) {
      updatedUnlockedMeditationIds.push(meditationId);
    } else {
      unsupportedFileNames.push(file.name || defaultFileName);
    }
  })

  return {
    updatedUnlockedMeditationIds,
    unsupportedFileNames,
  }
}

export const setUnlockedMeditationIdsInAsyncStorage = async (
  unlockedMeditationIds: MeditationId[],
) => {
  try {
    const stringifiedMeditationData = JSON.stringify(unlockedMeditationIds);
    if (stringifiedMeditationData !== null && stringifiedMeditationData !== undefined) {
      await AsyncStorage.setItem(storageKey, stringifiedMeditationData);
    }
  } catch(e) {
    console.log('Error with setting meditation data to Async Storage', e);
  }
}

export const getUnlockedMeditationIdsFromAsyncStorage = async () => {
  try {
    await AsyncStorage.getItem(storageKey);
  } catch (e) {
    console.log('error getting from storage', e);
  }
}

export const removeUnlockedMeditationIdsFromAsyncStorage = async () => {
  try {
    await AsyncStorage.removeItem(storageKey)
  } catch (e) {
    console.log('error removing from storage', e)
  }
}

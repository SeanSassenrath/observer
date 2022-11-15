import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from "lodash";

import { getMeditationName, meditationMap } from './meditation';
import { Meditation } from '../types';
import { storageKey } from '../contexts/meditationData';

export const pickFilesFromDevice = async (existingMeditations?: Meditation[]) => {
  const unsupportedNamesList: string[] = [];
  let normalizedMeditations: Meditation[] = []

  try {
    const files = await DocumentPicker.pick({ allowMultiSelection: true });

    normalizeMeditationData({files, normalizedMeditations, unsupportedNamesList})

    if (existingMeditations) {
      const joinedMeditations = [...normalizedMeditations, ...existingMeditations]
      _.uniqBy(joinedMeditations, 'id');
      normalizedMeditations = joinedMeditations;
    }
    return { normalizedMeditations, unsupportedNamesList }
  } catch(e) {
    console.log('Picking files error', e);
    return { normalizedMeditations, unsupportedNamesList }
  }
}

interface NormalizeMeditationParams {
  files: DocumentPickerResponse[],
  normalizedMeditations: Meditation[],
  unsupportedNamesList: string[],
}

const normalizeMeditationData = ({
  files,
  normalizedMeditations,
  unsupportedNamesList,
}: NormalizeMeditationParams) => {
  const defaultFileName = 'Unknown';

  files.map(file => {
    const normalizedMeditation = normalizeMeditation(file);

    if (
      normalizedMeditation === null ||
      normalizedMeditation === undefined
    ) {
      unsupportedNamesList.push(file.name || defaultFileName);
    } else {
      normalizedMeditations.push(normalizedMeditation);
    }
  })
};

const normalizeMeditation = (file: DocumentPickerResponse) => {
  if (!file.size) { return null; }

  const id = JSON.stringify(file.size);
  const isSupportedMeditation = meditationMap[id];
  if (!isSupportedMeditation) { return null; }

  return ({
    artist: 'Dr Joe Dispenza',
    id: id,
    name: getMeditationName(file.size),
    size: file.size,
  })
}

export const setNormalizedMeditationsInAsyncStorage = async (
  normalizedMeditations: Meditation[],
  setFiledStoredState: (p: boolean) => void,
) => {
  try {
    const stringifiedMeditationData = JSON.stringify(normalizedMeditations);
    if (stringifiedMeditationData !== null && stringifiedMeditationData !== undefined) {
      await AsyncStorage.setItem(storageKey, stringifiedMeditationData);
    }
    setFiledStoredState(true)
  } catch(e) {
    console.log('Error with setting meditation data to Async Storage', e);
  }
}

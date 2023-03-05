import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from "lodash";

import { MeditationBaseKeys, MeditationStringSizes } from '../constants/meditation';
import { storageKey } from '../contexts/meditationData';
import { MeditationId } from '../types';
import { MeditationFilePathData } from './asyncStorageMeditation';

export const pickFiles = async (
  existingMeditationFilePathData: MeditationFilePathData
) => {
  try {
    console.log('DOCUMENT PICKER: Existing picked files', existingMeditationFilePathData);
    const files = await DocumentPicker.pick({
      allowMultiSelection: true,
      copyTo: 'documentDirectory',
    });
    console.log('DOCUMENT PICKER: Picked files', files);
    const filePathDataList = makeFilePathDataList(files, existingMeditationFilePathData);
    console.log('DOCUMENT PICKER: File path data', filePathDataList);
    return filePathDataList as MeditationFilePathData;
  } catch (e) {
    console.log('DOCUMENT PICKER: Error picking files', e);
  }
}

const makeFilePathDataList = (
  files: DocumentPickerResponse[],
  existingMeditationFilePathData: MeditationFilePathData,
) => {
  let filePathDataMap = { ...existingMeditationFilePathData } as any;

  files.forEach(file => {
    const filePathData = makeFilePathData(file);
    if (filePathData) {
      filePathDataMap = { ...filePathDataMap, ...filePathData };
    }
  })

  return filePathDataMap;
}

const makeFilePathData = (file: DocumentPickerResponse) => {
  const fileSize = file.size;
  const fileSizeString = fileSize?.toString().slice(0, 5);
  console.log('sean >>', file);

  switch (fileSizeString) {
    case MeditationStringSizes.MedNewPotentialsV1:
      return {
        [MeditationBaseKeys.MedNewPotentialsV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.BreathNewPotentialsV1:
      return {
        [MeditationBaseKeys.BreathNewPotentialsV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedBreakingHabitSpaceV1:
      return {
        [MeditationBaseKeys.MedBreakingHabitSpaceV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedBreakingHabitWaterV1:
      return {
        [MeditationBaseKeys.MedBreakingHabitWaterV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedPresentMoment:
      return {
        [MeditationBaseKeys.MedPresentMomentV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedRecondition:
      return {
        [MeditationBaseKeys.MedReconditionV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.BreathRecondition:
      return {
        [MeditationBaseKeys.BreathReconditionV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedBlessingCenter1V1:
      return {
        [MeditationBaseKeys.MedBlessingCenter1V1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedBlessingCenter2V1:
      return {
        [MeditationBaseKeys.MedBlessingCenter2V1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedBlessingCenter3V1:
      return {
        [MeditationBaseKeys.MedBlessingCenter3V1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedBlessingCenter4V1:
      return {
        [MeditationBaseKeys.MedBlessingCenter4V1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedBlessingCenter5V1:
      return {
        [MeditationBaseKeys.MedBlessingCenter5V1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedBlessingCenter6V1:
      return {
        [MeditationBaseKeys.MedBlessingCenter6V1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedBlessingCenter7V1:
      return {
        [MeditationBaseKeys.MedBlessingCenter7V1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedBlessingCenter8V1:
      return {
        [MeditationBaseKeys.MedBlessingCenter8V1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedBlessingCenter9V1:
      return {
        [MeditationBaseKeys.MedBlessingCenter9V1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedDailyMorningV1:
      return {
        [MeditationBaseKeys.MedDailyMorningV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedDailyEveningV1:
      return {
        [MeditationBaseKeys.MedDailyEveningV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedLoveLifeV1:
      return {
        [MeditationBaseKeys.MedLoveLifeYouLoveV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedWalkingConditioningBodyV1:
      return {
        [MeditationBaseKeys.MedWalkingConditioningBodyV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedWalkingNobleWalkV1:
      return {
        [MeditationBaseKeys.MedWalkingNobleWalkV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedWalkingPrayerEvocationInvocationV1:
      return {
        [MeditationBaseKeys.MedWalkingPrayerEvocationInvocationV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedLoveLifeV1:
      return {
        [MeditationBaseKeys.MedWalkingUnlockingCodeV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedWalkingMeditation1V1:
      return {
        [MeditationBaseKeys.MedWalkingMeditation1V1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedWalkingMeditation2V1:
      return {
        [MeditationBaseKeys.MedWalkingMeditation2V1]: file.fileCopyUri,
      }
    default:
      break;
  }
}








// export const pickFilesFromDevice = async (unlockedMeditationIds: MeditationId[] = []) => {
//     try {
//       const files = await DocumentPicker.pick({ allowMultiSelection: true });
//       const { updatedUnlockedMeditationIds, unsupportedFileNames } = parsePickedFiles(files);

//       const joinedMeditationIds: MeditationId[] = [...unlockedMeditationIds, ...updatedUnlockedMeditationIds]
//       const dedupedMeditationIds = _.uniq(joinedMeditationIds);
  
//       return { updatedUnlockedMeditationIds: dedupedMeditationIds, unsupportedFileNames }
//     } catch(e) {
//       console.log('Picking files error', e);
//     }
//   }

// const parsePickedFiles = (files: DocumentPickerResponse[]) => {
//   const updatedUnlockedMeditationIds: MeditationId[] = [];
//   const unsupportedFileNames: string[] = [];
//   const defaultFileName = 'Unknown';

//   files.forEach(file => {
//     const meditationId = file.size?.toString()
//     if (meditationId && meditationMap[meditationId]) {
//       updatedUnlockedMeditationIds.push(meditationId);
//     } else {
//       unsupportedFileNames.push(file.name || defaultFileName);
//     }
//   })

//   return {
//     updatedUnlockedMeditationIds,
//     unsupportedFileNames,
//   }
// }













export const setUnlockedMeditationIdsInAsyncStorage = async (
  unlockedMeditationIds: MeditationId[],
) => {
  try {
    const stringifiedMeditationData = JSON.stringify(unlockedMeditationIds);
    console.log('setting files paths in async storage', stringifiedMeditationData);
    if (stringifiedMeditationData !== null && stringifiedMeditationData !== undefined) {
      await AsyncStorage.setItem(storageKey, stringifiedMeditationData);
    }
  } catch(e) {
    console.log('Error with setting meditation data to Async Storage', e);
  }
}

export const getUnlockedMeditationIdsFromAsyncStorage = async () => {
  try {
    const result = await AsyncStorage.getItem(storageKey);
    console.log('result', result);
    return result;
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

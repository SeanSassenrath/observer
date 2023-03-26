import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import _ from "lodash";

import { MeditationBaseKeys, MeditationStringSizes } from '../constants/meditation';
import { MeditationFilePathData } from './asyncStorageMeditation';

export const makeFilePathDataList = (
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
    case MeditationStringSizes.MedWalkingUnlockingCodeV1:
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

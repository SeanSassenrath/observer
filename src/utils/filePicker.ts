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
    case MeditationStringSizes.MedTurningYourLoveInwardV1:
      return {
        [MeditationBaseKeys.MedTurningYourLoveInwardV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedChangingBeliefsAndPerceptionsFullV1:
      return {
        [MeditationBaseKeys.MedChangingBeliefsAndPerceptionsFullV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedChangingBeliefsAndPerceptionsV1:
      return {
        [MeditationBaseKeys.MedChangingBeliefsAndPerceptionsV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.BreathChangingBeliefsAndPerceptionsV1:
      return {
        [MeditationBaseKeys.BreathChangingBeliefsAndPerceptionsV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedAlchemistV1:
      return {
        [MeditationBaseKeys.MedAlchemistV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedHeartBrainSyncV1:
      return {
        [MeditationBaseKeys.MedHeartBrainSyncV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedCourageousHeartV1:
      return {
        [MeditationBaseKeys.MedCourageousHeartV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedBreakingHabitsAddictionsV1:
      return {
        [MeditationBaseKeys.MedBreakingHabitsAddictionsV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedEmpoweringWithinV1:
      return {
        [MeditationBaseKeys.MedEmpoweringWithinV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedPinealGlandLongV1:
      return {
        [MeditationBaseKeys.MedPinealGlandLongV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedPinealGlandShortV1:
      return {
        [MeditationBaseKeys.MedPinealGlandShortV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedGeneratingAbundanceV1:
      return {
        [MeditationBaseKeys.MedGeneratingAbundanceV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedGeneratingFlowV1:
      return {
        [MeditationBaseKeys.MedGeneratingFlowV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedGeneratingGratitudeV1:
      return {
        [MeditationBaseKeys.MedGeneratingGratitudeV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedGeneratingEmpowermentV1:
      return {
        [MeditationBaseKeys.MedGeneratingEmpowermentV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedGeneratingChangeV1:
      return {
        [MeditationBaseKeys.MedGeneratingChangeV1]: file.fileCopyUri,
      }
    case MeditationStringSizes.MedGeneratingInspirationV1:
      return {
        [MeditationBaseKeys.MedGeneratingInspirationV1]: file.fileCopyUri,
      }
    default:
      break;
  }
}

import {Platform} from 'react-native';
import {DocumentPickerResponse} from 'react-native-document-picker';

import {
  MeditationBaseKeys,
  MeditationSizes,
  MeditationStringSizes,
} from '../constants/meditation';
import {MeditationFilePathData} from './asyncStorageMeditation';
import {UnsupportedFileData} from '../types';

export const makeFilePathDataList = (
  files: DocumentPickerResponse[],
  existingMeditationFilePathData: MeditationFilePathData,
) => {
  let filePathDataList = {...existingMeditationFilePathData} as any;
  let unsupportedFiles: UnsupportedFileData[] = [];

  files.forEach(file => {
    const filePathData = makeFilePathData(file);
    if (filePathData) {
      filePathDataList = {...filePathDataList, ...filePathData};
    } else {
      unsupportedFiles.push({
        name: file.name,
        type: file.type,
        size: file.size,
      });
    }
  });

  return {filePathDataList, unsupportedFiles};
};

const makeFilePathData = (file: DocumentPickerResponse) => {
  const fileSize = file.size;
  const fileSizeString = fileSize?.toString().slice(0, 5);

  // For meditations too close in size
  if (fileSize === MeditationSizes.GeneratingChange) {
    return {
      [MeditationBaseKeys.MedGeneratingChangeV1]: makeRelativeFilePath(
        file.fileCopyUri,
      ),
    };
  } else if (fileSize === MeditationSizes.GeneratingFlow) {
    return {
      [MeditationBaseKeys.MedGeneratingFlowV1]: makeRelativeFilePath(
        file.fileCopyUri,
      ),
    };
  }

  // For meditations that have large size differences
  switch (fileSizeString) {
    case MeditationStringSizes.MedNewPotentialsV1:
      return {
        [MeditationBaseKeys.MedNewPotentialsV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedNewPotentialsV2:
      return {
        [MeditationBaseKeys.MedNewPotentialsV2]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.BreathNewPotentialsV1:
      return {
        [MeditationBaseKeys.BreathNewPotentialsV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.BreathNewPotentialsV2:
      return {
        [MeditationBaseKeys.BreathNewPotentialsV2]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedBreakingHabitSpaceV1:
      return {
        [MeditationBaseKeys.MedBreakingHabitSpaceV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedBreakingHabitWaterV1:
      return {
        [MeditationBaseKeys.MedBreakingHabitWaterV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedPresentMomentV1:
      return {
        [MeditationBaseKeys.MedPresentMomentV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedPresentMomentV2:
      return {
        [MeditationBaseKeys.MedPresentMomentV2]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedPresentMomentV3:
      return {
        [MeditationBaseKeys.MedPresentMomentV2]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedRecondition:
      return {
        [MeditationBaseKeys.MedReconditionV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.BreathRecondition:
      return {
        [MeditationBaseKeys.BreathReconditionV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedBlessingCenter1V1:
      return {
        [MeditationBaseKeys.MedBlessingCenter1V1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedBlessingCenter2V1:
      return {
        [MeditationBaseKeys.MedBlessingCenter2V1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedBlessingCenter3V1:
      return {
        [MeditationBaseKeys.MedBlessingCenter3V1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedBlessingCenter4V1:
      return {
        [MeditationBaseKeys.MedBlessingCenter4V1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedBlessingCenter5V1:
      return {
        [MeditationBaseKeys.MedBlessingCenter5V1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedBlessingCenter6V1:
      return {
        [MeditationBaseKeys.MedBlessingCenter6V1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedBlessingCenter6V2:
      return {
        [MeditationBaseKeys.MedBlessingCenter6V2]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedBlessingCenter7V1:
      return {
        [MeditationBaseKeys.MedBlessingCenter7V1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedBlessingCenter7V2:
      return {
        [MeditationBaseKeys.MedBlessingCenter7V2]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedBlessingCenter8V1:
      return {
        [MeditationBaseKeys.MedBlessingCenter8V1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedBlessingCenter8V2:
      return {
        [MeditationBaseKeys.MedBlessingCenter8V2]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedBlessingCenter8V3:
      return {
        [MeditationBaseKeys.MedBlessingCenter8V2]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedBlessingCenter9V1:
      return {
        [MeditationBaseKeys.MedBlessingCenter9V1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedBlessingCenter9V2:
      return {
        [MeditationBaseKeys.MedBlessingCenter9V2]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedBlessingCenter9V3:
      return {
        [MeditationBaseKeys.MedBlessingCenter9V3]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedBlessingCenter10V1:
      return {
        [MeditationBaseKeys.MedBlessingCenter10V1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedBlessingCenter10V2:
      return {
        [MeditationBaseKeys.MedBlessingCenter10V2]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedDailyMorningV1:
      return {
        [MeditationBaseKeys.MedDailyMorningV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedDailyMorningV2:
      return {
        [MeditationBaseKeys.MedDailyMorningV2]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedDailyMorningUv:
      return {
        [MeditationBaseKeys.MedDailyMorningUv]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedDailyEveningV1:
      return {
        [MeditationBaseKeys.MedDailyEveningV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedDailyEveningV2:
      return {
        [MeditationBaseKeys.MedDailyEveningV2]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedDailyEveningUv:
      return {
        [MeditationBaseKeys.MedDailyEveningUv]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedLoveLifeV1:
      return {
        [MeditationBaseKeys.MedLoveLifeYouLoveV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedLoveLifeV2:
      return {
        [MeditationBaseKeys.MedLoveLifeYouLoveV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedWalkingBodyElectricV1:
      return {
        [MeditationBaseKeys.MedWalkingBodyElectricV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedWalkingConditioningBodyV1:
      return {
        [MeditationBaseKeys.MedWalkingConditioningBodyV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedWalkingConditioningBodyMp3:
      return {
        [MeditationBaseKeys.MedWalkingConditioningBodyV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedWalkingConditioningBodyMp3V2:
      return {
        [MeditationBaseKeys.MedWalkingConditioningBodyV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedWalkingNobleWalkV1:
      return {
        [MeditationBaseKeys.MedWalkingNobleWalkV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedWalkingPrayerEvocationInvocationV1:
      return {
        [MeditationBaseKeys.MedWalkingPrayerEvocationInvocationV1]:
          makeRelativeFilePath(file.fileCopyUri),
      };
    case MeditationStringSizes.MedWalkingPrayerEvocationInvocationV2:
      return {
        [MeditationBaseKeys.MedWalkingPrayerEvocationInvocationV2]:
          makeRelativeFilePath(file.fileCopyUri),
      };
    case MeditationStringSizes.MedWalkingPrayerEvocationInvocationMp4:
      return {
        [MeditationBaseKeys.MedWalkingPrayerEvocationInvocationV2]:
          makeRelativeFilePath(file.fileCopyUri),
      };
    case MeditationStringSizes.MedWalkingPrayerEvocationInvocationMp3:
      return {
        [MeditationBaseKeys.MedWalkingPrayerEvocationInvocationV2]:
          makeRelativeFilePath(file.fileCopyUri),
      };
    case MeditationStringSizes.MedWalkingUnlockingCodeV1:
      return {
        [MeditationBaseKeys.MedWalkingUnlockingCodeV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedWalkingUnlockingCodeV2:
      return {
        [MeditationBaseKeys.MedWalkingUnlockingCodeV2]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedWalkingUnlockingCodeMp3:
      return {
        [MeditationBaseKeys.MedWalkingUnlockingCodeV2]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedWalkingMeditation1V1:
      return {
        [MeditationBaseKeys.MedWalkingMeditation1V1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedWalkingMeditation1V2:
      return {
        [MeditationBaseKeys.MedWalkingMeditation1V2]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedWalkingMeditation2V1:
      return {
        [MeditationBaseKeys.MedWalkingMeditation2V1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedWalkingMeditation2V2:
      return {
        [MeditationBaseKeys.MedWalkingMeditation2V2]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedWalkingHeartFullMindV1:
      return {
        [MeditationBaseKeys.MedWalkingHeartFullMindV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedWalkingHeartFullMindV2:
      return {
        [MeditationBaseKeys.MedWalkingHeartFullMindV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedTurningYourLoveInwardV1:
      return {
        [MeditationBaseKeys.MedTurningYourLoveInwardV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedTurningYourLoveInwardV2:
      return {
        [MeditationBaseKeys.MedTurningYourLoveInwardV2]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedChangingBeliefsAndPerceptionsFullV1:
      return {
        [MeditationBaseKeys.MedChangingBeliefsAndPerceptionsFullV1]:
          makeRelativeFilePath(file.fileCopyUri),
      };
    case MeditationStringSizes.MedChangingBeliefsAndPerceptionsV1:
      return {
        [MeditationBaseKeys.MedChangingBeliefsAndPerceptionsV1]:
          makeRelativeFilePath(file.fileCopyUri),
      };
    case MeditationStringSizes.MedChangingBeliefsAndPerceptionsV2:
      return {
        [MeditationBaseKeys.MedChangingBeliefsAndPerceptionsV2]:
          makeRelativeFilePath(file.fileCopyUri),
      };
    case MeditationStringSizes.BreathChangingBeliefsAndPerceptionsV1:
      return {
        [MeditationBaseKeys.BreathChangingBeliefsAndPerceptionsV1]:
          makeRelativeFilePath(file.fileCopyUri),
      };
    case MeditationStringSizes.BreathChangingBeliefsAndPerceptionsV2:
      return {
        [MeditationBaseKeys.BreathChangingBeliefsAndPerceptionsV2]:
          makeRelativeFilePath(file.fileCopyUri),
      };
    case MeditationStringSizes.MedAlchemistV1:
      return {
        [MeditationBaseKeys.MedAlchemistV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedAlchemistV2:
      return {
        [MeditationBaseKeys.MedAlchemistV2]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedHeartBrainSyncV1:
      return {
        [MeditationBaseKeys.MedHeartBrainSyncV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedHeartBrainSyncV2:
      return {
        [MeditationBaseKeys.MedHeartBrainSyncV2]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedCourageousHeartV1:
      return {
        [MeditationBaseKeys.MedCourageousHeartV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedBreakingHabitsAddictionsV1:
      return {
        [MeditationBaseKeys.MedBreakingHabitsAddictionsV1]:
          makeRelativeFilePath(file.fileCopyUri),
      };
    case MeditationStringSizes.MedEmpoweringWithinV1:
      return {
        [MeditationBaseKeys.MedEmpoweringWithinV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedPinealGlandLongV1:
      return {
        [MeditationBaseKeys.MedPinealGlandLongV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedPinealGlandShortV1:
      return {
        [MeditationBaseKeys.MedPinealGlandShortV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedPinealGlandShortV2:
      return {
        [MeditationBaseKeys.MedPinealGlandShortV2]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedGeneratingAbundanceV1:
      return {
        [MeditationBaseKeys.MedGeneratingAbundanceV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedGeneratingGratitudeV1:
      return {
        [MeditationBaseKeys.MedGeneratingGratitudeV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedGeneratingEmpowermentV1:
      return {
        [MeditationBaseKeys.MedGeneratingEmpowermentV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedGeneratingEmpowermentV2:
      return {
        [MeditationBaseKeys.MedGeneratingEmpowermentV2]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedGeneratingInspirationV1:
      return {
        [MeditationBaseKeys.MedGeneratingInspirationV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedGeneratingJoyV1:
      return {
        [MeditationBaseKeys.MedGeneratingJoyV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedSyncToAbundanceV1:
      return {
        [MeditationBaseKeys.MedSyncToAbundanceV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedFallingIntoLoveBody:
      return {
        [MeditationBaseKeys.MedFallingIntoLoveBody]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.BreathInspireTribalV1:
      return {
        [MeditationBaseKeys.BreathInspireTribalTranceV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.BreathInspireBreathingLifeV1:
      return {
        [MeditationBaseKeys.BreathInspireBreathingLifeV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedSyncEnergyToHealth:
      return {
        [MeditationBaseKeys.MedSyncEnergyToHealth]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedSyncEnergyToLoveV1:
      return {
        [MeditationBaseKeys.MedSyncEnergyToLoveV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedSyncEnergyToLoveV2:
      return {
        [MeditationBaseKeys.MedSyncEnergyToLoveV2]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedSyncEnergyToLoveV3:
      return {
        [MeditationBaseKeys.MedSyncEnergyToLoveV3]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedSyncEnergyToAbundance:
      return {
        [MeditationBaseKeys.MedSyncEnergyToAbundance]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedSyncEnergyToNewLife:
      return {
        [MeditationBaseKeys.MedSyncEnergyToNewLife]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.MedPlaceboV1:
      return {
        [MeditationBaseKeys.MedPlaceboV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.BreathInspireAspirationV1:
      return {
        [MeditationBaseKeys.BreathInspireAspirationV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.BreathInspireCleansingV1:
      return {
        [MeditationBaseKeys.BreathInspireCleansingV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.BreathInspireEmergingHeartV1:
      return {
        [MeditationBaseKeys.BreathInspireEmergingHeartV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.BreathInspireInfernoV1:
      return {
        [MeditationBaseKeys.BreathInspireInfernoV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.BreathInspireKingfisherV1:
      return {
        [MeditationBaseKeys.BreathInspireKingfisherV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.BreathInspireRefugeV1:
      return {
        [MeditationBaseKeys.BreathInspireRefugeV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.BreathInspireShamanGoddessV1:
      return {
        [MeditationBaseKeys.BreathInspireShamanGoddessV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    case MeditationStringSizes.BreathInspireSuenosSelvaV1:
      return {
        [MeditationBaseKeys.BreathInspireSuenosSelvaV1]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    default:
      break;
  }
};

const makeRelativeFilePath = (absoluteFilePath: string | null) => {
  if (absoluteFilePath && Platform.OS === 'ios') {
    const splitFilePath = absoluteFilePath.split('/');
    return splitFilePath
      .slice(splitFilePath.length - 2, splitFilePath.length)
      .join('/');
  }
};

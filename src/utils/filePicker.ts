import {Platform} from 'react-native';
import {DocumentPickerResponse} from 'react-native-document-picker';

import {MeditationFilePathData} from './asyncStorageMeditation';
import {UnsupportedFileData} from '../types';
import {
  BotecBaseKeys,
  BotecStringSizes,
  BreakingHabitBaseKeys,
  BreakingHabitSizes,
  BreakingHabitStringSizes,
  BreathBaseKeys,
  BreathSizes,
  BreathStringSizes,
  DailyMeditationBaseKeys,
  DailyMeditationSizes,
  DailyMeditationStringSizes,
  FoundationalBaseKeys,
  FoundationalSizes,
  FoundationalStringSizes,
  GeneratingBaseKeys,
  GeneratingSizes,
  GeneratingStringSizes,
  OtherBaseKeys,
  OtherSizes,
  OtherStringSizes,
  SynchronizeBaseKeys,
  SynchronizeStringSizes,
  UnlockedBaseKeys,
  UnlockedStringSizes,
  WalkingBaseKeys,
  WalkingStringSizes,
} from '../constants/meditation-data';

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
      const fileCopyUri = makeRelativeFilePath(file.fileCopyUri) || null;
      unsupportedFiles.push({
        name: file.name,
        type: file.type,
        size: file.size,
        uri: fileCopyUri,
      });
    }
  });

  return {filePathDataList, unsupportedFiles};
};

const makeFilePathData = (file: DocumentPickerResponse) => {
  const fileSize = file.size;
  const fileSizeString = fileSize?.toString().slice(0, 5);

  console.log(' -- ');
  console.log(' ');
  console.log('fileSize', fileSize);
  console.log('fileSizeString', fileSizeString);
  console.log(' ');
  console.log(' -- ');

  // For meditations too close in size
  if (fileSize === BreathSizes.BreathNewPotentials) {
    return {
      [BreathBaseKeys.BreathNewPotentials]: makeRelativeFilePath(
        file.fileCopyUri,
      ),
    };
  } else if (fileSize === BreathSizes.BreathReconditioning) {
    return {
      [BreathBaseKeys.BreathReconditioning]: makeRelativeFilePath(
        file.fileCopyUri,
      ),
    };
    // } else if (fileSize === BreakingHabitSizes.MedBreakingHabitSpace) {
    //   return {
    //     [BreakingHabitBaseKeys.MedBreakingHabitSpace]: makeRelativeFilePath(
    //       file.fileCopyUri,
    //     ),
    //   };
    // } else if (fileSize === BreakingHabitSizes.MedBreakingHabitWater) {
    //   return {
    //     [BreakingHabitBaseKeys.MedBreakingHabitWater]: makeRelativeFilePath(
    //       file.fileCopyUri,
    //     ),
    //   };
  } else if (fileSize === DailyMeditationSizes.MedMorning) {
    return {
      [DailyMeditationBaseKeys.MedMorning]: makeRelativeFilePath(
        file.fileCopyUri,
      ),
    };
  } else if (fileSize === DailyMeditationSizes.MedEvening) {
    return {
      [DailyMeditationBaseKeys.MedEvening]: makeRelativeFilePath(
        file.fileCopyUri,
      ),
    };
  } else if (fileSize === FoundationalSizes.MedNewPotentials) {
    return {
      [FoundationalBaseKeys.MedNewPotentials]: makeRelativeFilePath(
        file.fileCopyUri,
      ),
    };
    // } else if (fileSize === FoundationalSizes.MedPresentMoment) {
    //   return {
    //     [FoundationalBaseKeys.MedPresentMoment]: makeRelativeFilePath(
    //       file.fileCopyUri,
    //     ),
    //   };
  } else if (fileSize === FoundationalSizes.MedRecondition) {
    return {
      [FoundationalBaseKeys.MedRecondition]: makeRelativeFilePath(
        file.fileCopyUri,
      ),
    };
  } else if (fileSize === GeneratingSizes.MedGeneratingChange) {
    return {
      [GeneratingBaseKeys.MedGeneratingChange]: makeRelativeFilePath(
        file.fileCopyUri,
      ),
    };
  } else if (fileSize === GeneratingSizes.MedGeneratingFlow) {
    return {
      [GeneratingBaseKeys.MedGeneratingFlow]: makeRelativeFilePath(
        file.fileCopyUri,
      ),
    };
  } else if (fileSize === OtherSizes.MedLoveLifeYouLove) {
    return {
      [OtherBaseKeys.MedLoveLifeYouLove]: makeRelativeFilePath(
        file.fileCopyUri,
      ),
    };
  }

  // For meditations that have large size differences
  switch (fileSizeString) {
    /* Blessing Energy Centers */

    case BotecStringSizes.MedBotec1: {
      return {
        [BotecBaseKeys.MedBotec1]: makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case BotecStringSizes.MedBotec2: {
      return {
        [BotecBaseKeys.MedBotec2]: makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case BotecStringSizes.MedBotec3: {
      return {
        [BotecBaseKeys.MedBotec3]: makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case BotecStringSizes.MedBotec4: {
      return {
        [BotecBaseKeys.MedBotec4]: makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case BotecStringSizes.MedBotec5: {
      return {
        [BotecBaseKeys.MedBotec5]: makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case BotecStringSizes.MedBotec6: {
      return {
        [BotecBaseKeys.MedBotec6]: makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case BotecStringSizes.MedBotec6s2: {
      return {
        [BotecBaseKeys.MedBotec6]: makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case BotecStringSizes.MedBotec7: {
      return {
        [BotecBaseKeys.MedBotec7]: makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case BotecStringSizes.MedBotec7s2: {
      return {
        [BotecBaseKeys.MedBotec7]: makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case BotecStringSizes.MedBotec8: {
      return {
        [BotecBaseKeys.MedBotec8]: makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case BotecStringSizes.MedBotec8s2: {
      return {
        [BotecBaseKeys.MedBotec8]: makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case BotecStringSizes.MedBotec9: {
      return {
        [BotecBaseKeys.MedBotec9]: makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case BotecStringSizes.MedBotec9s2: {
      return {
        [BotecBaseKeys.MedBotec9]: makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case BotecStringSizes.MedBotec9s3: {
      return {
        [BotecBaseKeys.MedBotec9]: makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case BotecStringSizes.MedBotec10: {
      return {
        [BotecBaseKeys.MedBotec10]: makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case BotecStringSizes.MedBotec10s2: {
      return {
        [BotecBaseKeys.MedBotec10]: makeRelativeFilePath(file.fileCopyUri),
      };
    }

    /* Breaking The Habit */

    case BreakingHabitStringSizes.MedBreakingHabitPlacebo: {
      return {
        [BreakingHabitBaseKeys.MedBreakingHabitPlacebo]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }

    /* Daily Meditations */

    // case DailyMeditationStringSizes.MedMorning2: {
    //   return {
    //     [DailyMeditationBaseKeys.MedMorning]: makeRelativeFilePath(
    //       file.fileCopyUri,
    //     ),
    //   };
    // }
    // case DailyMeditationStringSizes.MedMorningUpdated: {
    //   return {
    //     [DailyMeditationBaseKeys.MedMorningUpdated]: makeRelativeFilePath(
    //       file.fileCopyUri,
    //     ),
    //   };
    // }
    // case DailyMeditationStringSizes.MedMorningUpdated2: {
    //   return {
    //     [DailyMeditationBaseKeys.MedMorningUpdated]: makeRelativeFilePath(
    //       file.fileCopyUri,
    //     ),
    //   };
    // }
    case DailyMeditationStringSizes.MedEvening2: {
      return {
        [DailyMeditationBaseKeys.MedEvening]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case DailyMeditationStringSizes.MedEveningUpdated: {
      return {
        [DailyMeditationBaseKeys.MedEveningUpdated]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case DailyMeditationStringSizes.MedEveningUpdated2: {
      return {
        [DailyMeditationBaseKeys.MedEveningUpdated]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }

    /* Generating Series */

    case GeneratingStringSizes.MedGeneratingAbundance: {
      return {
        [GeneratingBaseKeys.MedGeneratingAbundance]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case GeneratingStringSizes.MedGeneratingGratitude: {
      return {
        [GeneratingBaseKeys.MedGeneratingGratitude]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case GeneratingStringSizes.MedGeneratingEmpowerment: {
      return {
        [GeneratingBaseKeys.MedGeneratingEmpowerment]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case GeneratingStringSizes.MedGeneratingEmpowerment2: {
      return {
        [GeneratingBaseKeys.MedGeneratingEmpowerment]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case GeneratingStringSizes.MedGeneratingInspiration: {
      return {
        [GeneratingBaseKeys.MedGeneratingInspiration]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case GeneratingStringSizes.MedGeneratingJoy: {
      return {
        [GeneratingBaseKeys.MedGeneratingJoy]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }

    /* Breath Work Tacks */

    case BreathStringSizes.BreathNewPotentialsUpdated: {
      return {
        [BreathBaseKeys.BreathNewPotentialsUpdated]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case BreathStringSizes.BreathChangingBeliefsAndPerceptions: {
      return {
        [BreathBaseKeys.BreathChangingBeliefsAndPerceptions]:
          makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case BreathStringSizes.BreathChangingBeliefsAndPerceptions2: {
      return {
        [BreathBaseKeys.BreathChangingBeliefsAndPerceptions]:
          makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case BreathStringSizes.BreathInspireTribalTrance: {
      return {
        [BreathBaseKeys.BreathInspireTribalTrance]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case BreathStringSizes.BreathInspireEmergingHeart: {
      return {
        [BreathBaseKeys.BreathInspireEmergingHeart]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case BreathStringSizes.BreathInspireSuenosSelva: {
      return {
        [BreathBaseKeys.BreathInspireSuenosSelva]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case BreathStringSizes.BreathInspireInferno: {
      return {
        [BreathBaseKeys.BreathInspireInferno]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case BreathStringSizes.BreathInspireRefuge: {
      return {
        [BreathBaseKeys.BreathInspireRefuge]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case BreathStringSizes.BreathInspireKingFisher: {
      return {
        [BreathBaseKeys.BreathInspireKingFisher]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case BreathStringSizes.BreathInspireShamanGoddess: {
      return {
        [BreathBaseKeys.BreathInspireShamanGoddess]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case BreathStringSizes.BreathInspireCleansing: {
      return {
        [BreathBaseKeys.BreathInspireCleansing]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case BreathStringSizes.BreathInspireAspiration: {
      return {
        [BreathBaseKeys.BreathInspireAspiration]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case BreathStringSizes.BreathInspireBreathingLife: {
      return {
        [BreathBaseKeys.BreathInspireBreathingLife]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }

    /* Foundational */

    case FoundationalStringSizes.MedNewPotentials2: {
      return {
        [FoundationalBaseKeys.MedNewPotentials]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case FoundationalStringSizes.MedNewPotentialsUpdated: {
      return {
        [FoundationalBaseKeys.MedNewPotentialsUpdated]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case FoundationalStringSizes.MedPresentMoment2: {
      return {
        [FoundationalBaseKeys.MedPresentMoment]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case FoundationalStringSizes.MedPresentMoment3: {
      return {
        [FoundationalBaseKeys.MedPresentMoment]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case FoundationalStringSizes.MedChangingBeliefsAndPerceptions: {
      return {
        [FoundationalBaseKeys.MedChangingBeliefsAndPerceptions]:
          makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case FoundationalStringSizes.MedChangingBeliefsAndPerceptions2: {
      return {
        [FoundationalBaseKeys.MedChangingBeliefsAndPerceptions]:
          makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case FoundationalStringSizes.MedChangingBeliefsAndPerceptionsFull: {
      return {
        [FoundationalBaseKeys.MedChangingBeliefsAndPerceptionsFull]:
          makeRelativeFilePath(file.fileCopyUri),
      };
    }

    /* Walking */

    case WalkingStringSizes.MedWalkingSteppingIntoYourFuture: {
      return {
        [WalkingBaseKeys.MedWalkingSteppingIntoYourFuture]:
          makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case WalkingStringSizes.MedWalkingSteppingIntoYourFuture2: {
      return {
        [WalkingBaseKeys.MedWalkingSteppingIntoYourFuture]:
          makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case WalkingStringSizes.MedWalkingSteppingIntoYourFutureUpdated: {
      return {
        [WalkingBaseKeys.MedWalkingSteppingIntoYourFutureUpdated]:
          makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case WalkingStringSizes.MedWalkingWithTheDevine: {
      return {
        [WalkingBaseKeys.MedWalkingWithTheDevine]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case WalkingStringSizes.MedWalkingWithTheDevineUpdated: {
      return {
        [WalkingBaseKeys.MedWalkingWithTheDevineUpdated]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case WalkingStringSizes.MedWalkingWithHeartFullMind: {
      return {
        [WalkingBaseKeys.MedWalkingWithHeartFullMind]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case WalkingStringSizes.MedWalkingWithHeartFullMind2: {
      return {
        [WalkingBaseKeys.MedWalkingWithHeartFullMind]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case WalkingStringSizes.MedWalkingBodyElectric: {
      return {
        [WalkingBaseKeys.MedWalkingBodyElectric]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case WalkingStringSizes.MedWalkingConditioningBody: {
      return {
        [WalkingBaseKeys.MedWalkingConditioningBody]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case WalkingStringSizes.MedWalkingNobleWalk: {
      return {
        [WalkingBaseKeys.MedWalkingNobleWalk]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case WalkingStringSizes.MedWalkingUnlockingCode: {
      return {
        [WalkingBaseKeys.MedWalkingUnlockingCode]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case WalkingStringSizes.MedWalkingUnlockingCode2: {
      return {
        [WalkingBaseKeys.MedWalkingUnlockingCode]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case WalkingStringSizes.MedWalkingUnlockingCode3: {
      return {
        [WalkingBaseKeys.MedWalkingUnlockingCode]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case WalkingStringSizes.MedWalkingPrayerEvocationInvocation: {
      return {
        [WalkingBaseKeys.MedWalkingPrayerEvocationInvocation]:
          makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case WalkingStringSizes.MedWalkingPrayerEvocationInvocation2: {
      return {
        [WalkingBaseKeys.MedWalkingPrayerEvocationInvocation]:
          makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case WalkingStringSizes.MedWalkingPrayerEvocationInvocation3: {
      return {
        [WalkingBaseKeys.MedWalkingPrayerEvocationInvocation]:
          makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case WalkingStringSizes.MedWalkingPrayerEvocationInvocation4: {
      return {
        [WalkingBaseKeys.MedWalkingPrayerEvocationInvocation]:
          makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case WalkingStringSizes.MedWalkingPrayerEvocationInvocation5: {
      return {
        [WalkingBaseKeys.MedWalkingPrayerEvocationInvocation]:
          makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case WalkingStringSizes.MedWalkingRadiantLight: {
      return {
        [WalkingBaseKeys.MedWalkingRadiantLight]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case WalkingStringSizes.MedWalkingRunning: {
      return {
        [WalkingBaseKeys.MedWalkingRunning]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }

    /* Syncronize */

    case SynchronizeStringSizes.MedSyncHealth: {
      return {
        [SynchronizeBaseKeys.MedSyncHealth]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case SynchronizeStringSizes.MedSyncAbundance: {
      return {
        [SynchronizeBaseKeys.MedSyncAbundance]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case SynchronizeStringSizes.MedSyncAbundance2: {
      return {
        [SynchronizeBaseKeys.MedSyncAbundance]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case SynchronizeStringSizes.MedSyncAbundance3: {
      return {
        [SynchronizeBaseKeys.MedSyncAbundance]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case SynchronizeStringSizes.MedSyncEnergyToNewLife: {
      return {
        [SynchronizeBaseKeys.MedSyncEnergyToNewLife]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case SynchronizeStringSizes.MedSyncEnergyToNewLife2: {
      return {
        [SynchronizeBaseKeys.MedSyncEnergyToNewLife]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case SynchronizeStringSizes.MedSyncEnergyToLove: {
      return {
        [SynchronizeBaseKeys.MedSyncEnergyToLove]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case SynchronizeStringSizes.MedSyncEnergyToLove2: {
      return {
        [SynchronizeBaseKeys.MedSyncEnergyToLove]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case SynchronizeStringSizes.MedSyncEnergyToLove3: {
      return {
        [SynchronizeBaseKeys.MedSyncEnergyToLove]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case SynchronizeStringSizes.MedSyncEnergyToLove4: {
      return {
        [SynchronizeBaseKeys.MedSyncEnergyToLove]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }

    /* Unlocked */

    case UnlockedStringSizes.MedUnlockedS1P3: {
      return {
        [UnlockedBaseKeys.MedUnlockedS1P3]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case UnlockedStringSizes.MedUnlockedS2P3: {
      return {
        [UnlockedBaseKeys.MedUnlockedS2P3]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case UnlockedStringSizes.MedUnlockedS3P3: {
      return {
        [UnlockedBaseKeys.MedUnlockedS3P3]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case UnlockedStringSizes.MedUnlockedS4P3: {
      return {
        [UnlockedBaseKeys.MedUnlockedS4P3]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }

    /* Other */

    case OtherStringSizes.MedAlchemist: {
      return {
        [OtherBaseKeys.MedAlchemist]: makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case OtherStringSizes.MedAlchemist2: {
      return {
        [OtherBaseKeys.MedAlchemist]: makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case OtherStringSizes.MedChangingBoxes: {
      return {
        [OtherBaseKeys.MedChangingBoxes]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case OtherStringSizes.MedChangingBoxes2: {
      return {
        [OtherBaseKeys.MedChangingBoxes]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case OtherStringSizes.MedGoLove: {
      return {
        [OtherBaseKeys.MedGoLove]: makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case OtherStringSizes.MedGoLove2: {
      return {
        [OtherBaseKeys.MedGoLove]: makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case OtherStringSizes.MedGoLove3: {
      return {
        [OtherBaseKeys.MedGoLove]: makeRelativeFilePath(file.fileCopyUri),
      };
    }
    case OtherStringSizes.MedHigherLoveCouples: {
      return {
        [OtherBaseKeys.MedHigherLoveCouples]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case OtherStringSizes.MedTurningYourLoveInward: {
      return {
        [OtherBaseKeys.MedTurningYourLoveInward]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case OtherStringSizes.MedTurningYourLoveInward2: {
      return {
        [OtherBaseKeys.MedTurningYourLoveInward]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case OtherStringSizes.MedHeartBrainSync: {
      return {
        [OtherBaseKeys.MedHeartBrainSync]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case OtherStringSizes.MedHeartBrainSync2: {
      return {
        [OtherBaseKeys.MedHeartBrainSync]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case OtherStringSizes.MedCourageousHeart: {
      return {
        [OtherBaseKeys.MedCourageousHeart]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case OtherStringSizes.MedBreakingHabitsAddictions: {
      return {
        [OtherBaseKeys.MedBreakingHabitsAddictions]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case OtherStringSizes.MedEmpoweringWithin: {
      return {
        [OtherBaseKeys.MedEmpoweringWithin]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case OtherStringSizes.MedPinealGlandLong: {
      return {
        [OtherBaseKeys.MedPinealGlandLong]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case OtherStringSizes.MedPinealGlandShort: {
      return {
        [OtherBaseKeys.MedPinealGlandShort]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case OtherStringSizes.MedPinealGlandShort2: {
      return {
        [OtherBaseKeys.MedPinealGlandShort]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }
    case OtherStringSizes.MedFallingIntoLoveBody: {
      return {
        [OtherBaseKeys.MedFallingIntoLoveBody]: makeRelativeFilePath(
          file.fileCopyUri,
        ),
      };
    }

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

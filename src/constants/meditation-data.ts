import {MeditationTypes} from '../types';

const artist = 'Dr. Joe Dispenza';
const placeholder = '';

export enum MeditationGroupName {
  'BlessingEnergyCenter' = 'Blessing of the Energy Centers',
  'BreakingHabit' = 'Breaking the Habit of Being Yourself',
  'Daily' = 'Daily Meditations',
  'Generating' = 'Generating Series',
  'BreathTracks' = 'Breathwork',
  'Foundational' = 'Foundational - Progressive',
  'Walking' = 'Walking',
  'Synchronize' = 'Synchronize Series',
  'Unlocked' = 'Unlocked Series',
  'Other' = 'Other',
}

/* Blessing Energy Centers */

export enum BotecBaseKeys {
  MedBotec1 = 'm-botec-1',
  MedBotec2 = 'm-botec-2',
  MedBotec3 = 'm-botec-3',
  MedBotec4 = 'm-botec-4',
  MedBotec5 = 'm-botec-5',
  MedBotec6 = 'm-botec-6',
  MedBotec7 = 'm-botec-7',
  MedBotec8 = 'm-botec-8',
  MedBotec9 = 'm-botec-9',
  MedBotec10 = 'm-botec-10',
}

export enum BotecSizes {
  MedBotec1 = 61719924,
  MedBotec2 = 69705557,
  MedBotec3 = 77717479,
  MedBotec4 = 93864414,
  MedBotec5 = 104215154,
  MedBotec6 = 110108828,
  MedBotec6s2 = 73078110,
  MedBotec7 = 107656059,
  MedBotec7s2 = 72338676,
  MedBotec8 = 135964319,
  MedBotec8s2 = 91332341,
  MedBotec9 = 211753731,
  MedBotec9s2 = 149230439,
  MedBotec9s3 = 85552981,
  MedBotec10 = 138202744,
  MedBotec10s2 = 55797552,
}

export enum BotecStringSizes {
  MedBotec1 = '61719',
  MedBotec2 = '69705',
  MedBotec3 = '77717',
  MedBotec4 = '93864',
  MedBotec5 = '10421',
  MedBotec6 = '11010',
  MedBotec6s2 = '73078',
  MedBotec7 = '10765',
  MedBotec7s2 = '72338',
  MedBotec8 = '13596',
  MedBotec8s2 = '91332',
  MedBotec9 = '21175',
  MedBotec9s2 = '14923',
  MedBotec9s3 = '85552',
  MedBotec10 = '13820',
  MedBotec10s2 = '55797',
}

export const botecMap = {
  [BotecBaseKeys.MedBotec1]: {
    artist,
    backgroundImage: require('../assets/bec-1.jpg'),
    formattedDuration: '42',
    id: placeholder,
    groupName: MeditationGroupName.BlessingEnergyCenter,
    meditationBaseId: BotecBaseKeys.MedBotec1,
    name: 'Blessing of the Energy Centers 01',
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
  [BotecBaseKeys.MedBotec2]: {
    artist,
    backgroundImage: require('../assets/bec-2.jpg'),
    formattedDuration: '47',
    id: placeholder,
    groupName: MeditationGroupName.BlessingEnergyCenter,
    meditationBaseId: BotecBaseKeys.MedBotec2,
    name: 'Blessing of the Energy Centers 02',
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
  [BotecBaseKeys.MedBotec3]: {
    artist,
    backgroundImage: require('../assets/bec-3.jpg'),
    formattedDuration: '54',
    id: placeholder,
    groupName: MeditationGroupName.BlessingEnergyCenter,
    meditationBaseId: BotecBaseKeys.MedBotec3,
    name: 'Blessing of the Energy Centers 03',
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
  [BotecBaseKeys.MedBotec4]: {
    artist,
    backgroundImage: require('../assets/bec-4.jpg'),
    formattedDuration: '65',
    id: placeholder,
    groupName: MeditationGroupName.BlessingEnergyCenter,
    meditationBaseId: BotecBaseKeys.MedBotec4,
    name: 'Blessing of the Energy Centers 04',
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
  [BotecBaseKeys.MedBotec5]: {
    artist,
    backgroundImage: require('../assets/bec-5.jpg'),
    formattedDuration: '71',
    id: placeholder,
    groupName: MeditationGroupName.BlessingEnergyCenter,
    meditationBaseId: BotecBaseKeys.MedBotec5,
    name: 'Blessing of the Energy Centers 05',
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
  [BotecBaseKeys.MedBotec6]: {
    artist,
    backgroundImage: require('../assets/bec-6.jpg'),
    formattedDuration: '75',
    id: placeholder,
    groupName: MeditationGroupName.BlessingEnergyCenter,
    meditationBaseId: BotecBaseKeys.MedBotec6,
    name: 'Blessing of the Energy Centers 06',
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
  [BotecBaseKeys.MedBotec7]: {
    artist,
    backgroundImage: require('../assets/bec-7.jpg'),
    formattedDuration: '74',
    id: placeholder,
    groupName: MeditationGroupName.BlessingEnergyCenter,
    meditationBaseId: BotecBaseKeys.MedBotec7,
    name: 'Blessing of the Energy Centers 07',
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
  [BotecBaseKeys.MedBotec8]: {
    artist,
    backgroundImage: require('../assets/bec-8.jpg'),
    formattedDuration: '94',
    id: placeholder,
    groupName: MeditationGroupName.BlessingEnergyCenter,
    meditationBaseId: BotecBaseKeys.MedBotec8,
    name: 'Blessing of the Energy Centers 08',
    size: BotecSizes.MedBotec8,
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
  [BotecBaseKeys.MedBotec9]: {
    artist,
    backgroundImage: require('../assets/bec-9.jpg'),
    formattedDuration: '88',
    id: placeholder,
    groupName: MeditationGroupName.BlessingEnergyCenter,
    meditationBaseId: BotecBaseKeys.MedBotec9,
    name: 'Blessing of the Energy Centers 09',
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
  [BotecBaseKeys.MedBotec10]: {
    artist,
    backgroundImage: require('../assets/bec-10.jpg'),
    formattedDuration: '62',
    id: placeholder,
    groupName: MeditationGroupName.BlessingEnergyCenter,
    meditationBaseId: BotecBaseKeys.MedBotec10,
    name: 'Blessing of the Energy Centers 10',
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
};

/* Breaking The Habit */

export enum BreakingHabitBaseKeys {
  MedBreakingHabitSpace = 'm-breaking-habit-space',
  MedBreakingHabitWater = 'm-breaking-habit-water',
  MedBreakingHabitPlacebo = 'm-breaking-habit-placebo',
}

export enum BreakingHabitSizes {
  MedBreakingHabitSpace = 149360649,
  MedBreakingHabitWater = 140710975,
  MedBreakingHabitPlacebo = 58249006,
}

export enum BreakingHabitStringSizes {
  MedBreakingHabitSpace = '14936',
  MedBreakingHabitWater = '14071',
  MedBreakingHabitPlacebo = '58249',
}

export const breakingHabitMap = {
  [BreakingHabitBaseKeys.MedBreakingHabitSpace]: {
    artist,
    backgroundImage: require('../assets/breaking_habit.jpg'),
    formattedDuration: '74',
    id: placeholder,
    groupName: MeditationGroupName.BreakingHabit,
    meditationBaseId: BreakingHabitBaseKeys.MedBreakingHabitSpace,
    name: 'Breaking The Habit Of Being Yourself',
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
  [BreakingHabitBaseKeys.MedBreakingHabitWater]: {
    artist,
    backgroundImage: require('../assets/breaking_habit.jpg'),
    formattedDuration: '70',
    id: placeholder,
    groupName: MeditationGroupName.BreakingHabit,
    meditationBaseId: BreakingHabitBaseKeys.MedBreakingHabitWater,
    name: 'Breaking The Habit Of Being Yourself - Water',
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
  [BreakingHabitBaseKeys.MedBreakingHabitPlacebo]: {
    artist,
    backgroundImage: require('../assets/placebo.jpg'),
    formattedDuration: '69',
    id: placeholder,
    groupName: MeditationGroupName.BreakingHabit,
    meditationBaseId: BreakingHabitBaseKeys.MedBreakingHabitPlacebo,
    name: 'You are the Placebo',
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
};

/* Daily Meditations */

export enum DailyMeditationBaseKeys {
  MedMorning = 'm-morning',
  MedMorningUpdated = 'm-morning-updated',
  MedEvening = 'm-evening',
  MedEveningUpdated = 'm-evening-updated',
}

export enum DailyMeditationSizes {
  MedMorning = 34907925,
  MedMorning2 = 23187022,
  MedMorningUpdated = 33578871,
  MedMorningUpdated2 = 57534699,
  MedEvening = 29178857,
  MedEvening2 = 29178857,
  MedEveningUpdated = 29178857,
  MedEveningUpdated2 = 56234919,
}

export enum DailyMeditationStringSizes {
  MedMorning = '34907',
  MedMorning2 = '23187',
  MedMorningUpdated = '33578',
  MedMorningUpdated2 = '57534',
  MedEvening = '34099',
  MedEvening2 = '22604',
  MedEveningUpdated = '29178',
  MedEveningUpdated2 = '56234',
}

export const dailyMeditationsMap = {
  [DailyMeditationBaseKeys.MedMorning]: {
    artist,
    backgroundImage: require('../assets/daily.jpg'),
    formattedDuration: '24',
    id: placeholder,
    groupName: MeditationGroupName.Daily,
    meditationBaseId: DailyMeditationBaseKeys.MedMorning,
    name: 'Daily Morning Meditation',
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
  [DailyMeditationBaseKeys.MedMorningUpdated]: {
    artist,
    backgroundImage: require('../assets/daily.jpg'),
    formattedDuration: '24',
    id: placeholder,
    groupName: MeditationGroupName.Daily,
    meditationBaseId: DailyMeditationBaseKeys.MedMorningUpdated,
    name: 'Daily Morning - Updated',
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
  [DailyMeditationBaseKeys.MedEvening]: {
    artist,
    backgroundImage: require('../assets/daily.jpg'),
    formattedDuration: '24',
    id: placeholder,
    groupName: MeditationGroupName.Daily,
    meditationBaseId: DailyMeditationBaseKeys.MedEvening,
    name: 'Daily Evening',
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
  [DailyMeditationBaseKeys.MedEveningUpdated]: {
    artist,
    backgroundImage: require('../assets/daily.jpg'),
    formattedDuration: '23',
    id: placeholder,
    groupName: MeditationGroupName.Daily,
    meditationBaseId: DailyMeditationBaseKeys.MedEveningUpdated,
    name: 'Daily Evening - Updated',
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
};

/* Generating Series */
export enum GeneratingBaseKeys {
  MedGeneratingAbundance = 'm-generating-abundance',
  MedGeneratingFlow = 'm-generating-flow',
  MedGeneratingGratitude = 'm-generating-gratitude',
  MedGeneratingEmpowerment = 'm-generating-empowerment',
  MedGeneratingChange = 'm-generating-change',
  MedGeneratingInspiration = 'm-generating-inspiration',
  MedGeneratingJoy = 'm-generating-joy',
}

export enum GeneratingSizes {
  MedGeneratingAbundance = 86671093,
  MedGeneratingFlow = 14599092,
  MedGeneratingGratitude = 14594274,
  MedGeneratingEmpowerment = 14596134,
  MedGeneratingEmpowerment2 = 14578838,
  MedGeneratingChange = 14599015,
  MedGeneratingInspiration = 15099669,
  MedGeneratingJoy = 14593178,
}

export enum GeneratingStringSizes {
  MedGeneratingAbundance = '86671',
  MedGeneratingFlow = '14599',
  MedGeneratingGratitude = '14594',
  MedGeneratingEmpowerment = '14596',
  MedGeneratingEmpowerment2 = '14578',
  MedGeneratingChange = '14599',
  MedGeneratingInspiration = '15099',
  MedGeneratingJoy = '14593',
}

export const generatingMap = {
  [GeneratingBaseKeys.MedGeneratingAbundance]: {
    artist,
    backgroundImage: require('../assets/abundance.jpg'),
    formattedDuration: '60',
    id: placeholder,
    groupName: MeditationGroupName.Generating,
    meditationBaseId: GeneratingBaseKeys.MedGeneratingAbundance,
    name: 'Generating Abundance',
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
  [GeneratingBaseKeys.MedGeneratingFlow]: {
    artist,
    backgroundImage: require('../assets/flow.jpg'),
    formattedDuration: '15',
    id: placeholder,
    groupName: MeditationGroupName.Generating,
    meditationBaseId: GeneratingBaseKeys.MedGeneratingFlow,
    name: 'Generating Flow',
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
  [GeneratingBaseKeys.MedGeneratingGratitude]: {
    artist,
    backgroundImage: require('../assets/gratitude.jpg'),
    formattedDuration: '15',
    id: placeholder,
    groupName: MeditationGroupName.Generating,
    meditationBaseId: GeneratingBaseKeys.MedGeneratingGratitude,
    name: 'Generating Gratitude',
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
  [GeneratingBaseKeys.MedGeneratingEmpowerment]: {
    artist,
    backgroundImage: require('../assets/empowerment.jpg'),
    formattedDuration: '15',
    id: placeholder,
    groupName: MeditationGroupName.Generating,
    meditationBaseId: GeneratingBaseKeys.MedGeneratingEmpowerment,
    name: 'Generating Empowerment',
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
  [GeneratingBaseKeys.MedGeneratingChange]: {
    artist,
    backgroundImage: require('../assets/change.jpg'),
    formattedDuration: '15',
    id: placeholder,
    groupName: MeditationGroupName.Generating,
    meditationBaseId: GeneratingBaseKeys.MedGeneratingChange,
    name: 'Generating Change',
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
  [GeneratingBaseKeys.MedGeneratingInspiration]: {
    artist,
    backgroundImage: require('../assets/inspiration.jpg'),
    formattedDuration: '15',
    id: placeholder,
    groupName: MeditationGroupName.Generating,
    meditationBaseId: GeneratingBaseKeys.MedGeneratingInspiration,
    name: 'Generating Inspiration',
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
  [GeneratingBaseKeys.MedGeneratingJoy]: {
    artist,
    backgroundImage: require('../assets/generate-joy.jpg'),
    formattedDuration: '15',
    id: placeholder,
    groupName: MeditationGroupName.Generating,
    meditationBaseId: GeneratingBaseKeys.MedGeneratingJoy,
    name: 'Generating Joy',
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
};

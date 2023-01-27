import { MeditationBaseMap, MeditationMap, MeditationTypes } from "../types";

export enum MeditationBaseKeys {
  MedNewPotentialsV1 = 'm-new-potentials-v1',
  BreathNewPotentialsV1 = 'b-new-potentials-v1',
  MedBreakingHabitSpaceV1 = 'm-breaking-habit-space-v1',
  MedBreakingHabitWaterV1 = 'm-breaking-habit-water-v1',
  MedPresentMomentV1 = 'm-present-moment-v1',
  MedDailyMorningV1 = 'm-daily-morning-v1',
  MedDailyEveningV1 = 'm-daily-evening-v1',
  MedReconditionV1 = 'm-recondition-v1',
  BreathReconditionV1 = 'b-recondition-v1',
}

export enum MeditationStringSizes {
  MedNewPotentialsV1 = '56004',
  BreathNewPotentialsV1 = '96748',
  MedBreakingHabitSpaceV1 = '14936',
  MedBreakingHabitWaterV1 = '14071',
  MedPresentMoment = '68710',
  MedRecondition = '55295',
  BreathRecondition = '95032',
}

export enum MeditationKeys {
  NewPotentials = '56004113',
  NewPotentialsBreath = '9674897',
  BreakingTheHabit = '149360649',
  BreakingTheHabitWater = '140710975',
  PresentMoment = '68710984',
  Recondition = '55295394',
  ReconditionBreath = '9503256',
}

export enum MeditationSizes {
  NewPotentials = 56004113,
  NewPotentialsBreath = 9674897,
  BreakingTheHabit = 149360649,
  BreakingTheHabitWater = 140710975,
  PresentMoment = 68710984,
  Recondition = 55295394,
  ReconditionBreath = 9503256,
}

export enum MeditationGroupKey {
  'EnergyCenter' = 'energyCenter',
  'NewPotential' = 'newPotential',
  'BreakingHabit' = 'breakingHabit',
  'Recondition' = 'recondition',
  'Other' = 'other',
}

export enum MeditationGroupName {
  'EnergyCenter' = 'Blessing of the Energy Centers',
  'NewPotential' = 'Tuning Into New Potentials',
  'BreakingHabit' = 'Breaking the Habit of Being Yourself',
  'Recondition' = 'Reconditioning the Body to a New Mind',
  'Other' = 'Other'
}

const artist = 'Dr. Joe Dispenza';
const placeholder = '';

export const meditationBaseMap: MeditationBaseMap = {
  [MeditationBaseKeys.MedNewPotentialsV1]: {
    artwork: '',
    artist,
    backgroundImage: require('../assets/new_potential.png'),
    color: '#055304',
    formattedDuration: '45',
    id: placeholder,
    groupKey: MeditationGroupKey.NewPotential,
    groupName: MeditationGroupName.NewPotential,
    meditationBaseId: MeditationBaseKeys.MedNewPotentialsV1,
    name: 'Tuning Into New Potentials',
    size: MeditationSizes.NewPotentials,
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
  [MeditationBaseKeys.BreathNewPotentialsV1]: {
    artwork: '',
    artist,
    backgroundImage: require('../assets/new_potential.png'),
    color: '#055304',
    formattedDuration: '7',
    id: placeholder,
    groupKey: MeditationGroupKey.NewPotential,
    groupName: MeditationGroupName.NewPotential,
    meditationBaseId: MeditationBaseKeys.BreathNewPotentialsV1,
    name: 'Tuning Into New Potentials - Breath',
    size: MeditationSizes.NewPotentialsBreath,
    type: MeditationTypes.Breath,
    url: placeholder,
  },
  [MeditationBaseKeys.MedBreakingHabitSpaceV1]: {
    artwork: '',
    artist,
    backgroundImage: require('../assets/breaking_habit.png'),
    color: '#003E54',
    formattedDuration: '15',
    id: placeholder,
    groupKey: MeditationGroupKey.BreakingHabit,
    groupName: MeditationGroupName.BreakingHabit,
    meditationBaseId: MeditationBaseKeys.MedBreakingHabitSpaceV1,
    name: 'Breaking The Habit Of Being Yourself',
    size: MeditationSizes.BreakingTheHabit,
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
  [MeditationBaseKeys.MedBreakingHabitWaterV1]: {
    artwork: '',
    artist,
    backgroundImage: require('../assets/breaking_habit.png'),
    color: '#003E54',
    formattedDuration: '11',
    id: placeholder,
    groupKey: MeditationGroupKey.BreakingHabit,
    groupName: MeditationGroupName.BreakingHabit,
    meditationBaseId: MeditationBaseKeys.MedBreakingHabitWaterV1,
    name: 'Breaking The Habit Of Being Yourself - Water',
    size: MeditationSizes.BreakingTheHabitWater,
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
  [MeditationBaseKeys.MedPresentMomentV1]: {
    artwork: '',
    artist,
    backgroundImage: require('../assets/present_moment.png'),
    color: '#003E54',
    formattedDuration: '47',
    id: placeholder,
    groupKey: MeditationGroupKey.Other,
    groupName: MeditationGroupName.Other,
    meditationBaseId: MeditationBaseKeys.MedPresentMomentV1,
    name: 'Generous Present Moment',
    size: MeditationSizes.PresentMoment,
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
  [MeditationBaseKeys.MedReconditionV1]: {
    artwork: '',
    artist,
    backgroundImage: require('../assets/recondition.png'),
    color: '#003E54',
    formattedDuration: '46',
    id: placeholder,
    groupKey: MeditationGroupKey.Recondition,
    groupName: MeditationGroupName.Recondition,
    meditationBaseId: MeditationBaseKeys.MedReconditionV1,
    name: 'Reconditioning the Body to a New Mind',
    size: MeditationSizes.Recondition,
    type: MeditationTypes.Meditation,
    url: placeholder,
  },
  [MeditationBaseKeys.BreathReconditionV1]: {
    artwork: '',
    artist,
    backgroundImage: require('../assets/recondition.png'),
    color: '#003E54',
    formattedDuration: '8',
    id: placeholder,
    groupKey: MeditationGroupKey.Recondition,
    groupName: MeditationGroupName.Recondition,
    meditationBaseId: MeditationBaseKeys.BreathReconditionV1,
    name: 'Reconditioning the Body to a New Mind - Breath',
    size: MeditationSizes.ReconditionBreath,
    type: MeditationTypes.Breath,
    url: placeholder,
  },
}

export const newPotentialGroupIds = [MeditationKeys.NewPotentials, MeditationKeys.NewPotentialsBreath]
export const breakingHabitGroupIds = [MeditationKeys.BreakingTheHabit, MeditationKeys.BreakingTheHabitWater];

export const breathMeditationTypeBaseIds = [
  MeditationBaseKeys.BreathNewPotentialsV1,
  MeditationBaseKeys.BreathReconditionV1,
]

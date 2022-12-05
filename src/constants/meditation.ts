import { MeditationMap } from "../types";

export enum MeditationKeys {
  NewPotentials = '56004113',
  NewPotentialsBreath = '9674897',
  BreakingTheHabit = '149360649',
  BreakingTheHabitWater = '140710975',
}

export enum MeditationSizes {
  NewPotentials = 56004113,
  NewPotentialsBreath = 9674897,
  BreakingTheHabit = 149360649,
  BreakingTheHabitWater = 140710975,
}

export enum MeditationGroupKey {
  'EnergyCenter' = 'energyCenter',
  'NewPotential' = 'newPotential',
  'BreakingHabit' = 'breakingHabit',
}

export enum MeditationGroupName {
  'EnergyCenter' = 'Blessing of the Energy Centers',
  'NewPotential' = 'Tuning Into New Potentials',
  'BreakingHabit' = 'Breaking the Habit of Being Yourself',
}

const artist = 'Dr. Joe Dispenza';
const placeholder = '';

export const meditationMap: MeditationMap = {
  [MeditationKeys.NewPotentials]: {
    artwork: '',
    artist,
    backgroundImage: require('../assets/new_potential.png'),
    color: '#055304',
    formattedDuration: '45',
    id: placeholder,
    groupKey: MeditationGroupKey.NewPotential,
    groupName: MeditationGroupName.NewPotential,
    meditationId: MeditationKeys.NewPotentials,
    meditationBreathId: MeditationKeys.NewPotentialsBreath,
    name: 'Tuning Into New Potentials',
    size: MeditationSizes.NewPotentials,
    url: require('../tracks/56004113.mp3'),
  },
  [MeditationKeys.NewPotentialsBreath]: {
    artwork: '',
    artist,
    backgroundImage: require('../assets/new_potential.png'),
    color: '#055304',
    formattedDuration: '7',
    id: placeholder,
    groupKey: MeditationGroupKey.NewPotential,
    groupName: MeditationGroupName.NewPotential,
    meditationId: MeditationKeys.NewPotentialsBreath,
    name: 'Tuning Into New Potentials - Breath',
    size: MeditationSizes.NewPotentialsBreath,
    url: require('../tracks/9674897.mp3'),
  },
  [MeditationKeys.BreakingTheHabit]: {
    artwork: '',
    artist,
    backgroundImage: require('../assets/breaking_habit.png'),
    color: '#003E54',
    formattedDuration: '15',
    id: placeholder,
    groupKey: MeditationGroupKey.BreakingHabit,
    groupName: MeditationGroupName.BreakingHabit,
    meditationId: MeditationKeys.BreakingTheHabit,
    name: 'Breaking The Habit Of Being Yourself',
    size: MeditationSizes.BreakingTheHabit,
    url: require('../tracks/149360649.m4a'),
  },
  [MeditationKeys.BreakingTheHabitWater]: {
    artwork: '',
    artist,
    backgroundImage: require('../assets/breaking_habit.png'),
    color: '#003E54',
    formattedDuration: '11',
    id: placeholder,
    groupKey: MeditationGroupKey.BreakingHabit,
    groupName: MeditationGroupName.BreakingHabit,
    meditationId: MeditationKeys.BreakingTheHabitWater,
    name: 'Breaking The Habit Of Being Yourself - Water',
    size: MeditationSizes.BreakingTheHabitWater,
    url: require('../tracks/140710975.m4a'),
  },
}

export const newPotentialGroupIds = [MeditationKeys.NewPotentials, MeditationKeys.NewPotentialsBreath]
export const breakingHabitGroupIds = [MeditationKeys.BreakingTheHabit, MeditationKeys.BreakingTheHabitWater];

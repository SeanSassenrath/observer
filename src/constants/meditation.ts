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

export enum MeditationGroup {
  'EnergyCenter' = 'Blessing of the Energy Centers',
  'NewPotential' = 'Tuning Into New Potentials',
  'BreakingHabit' = 'Breaking the Habit of Being Yourself',
}

const artist = 'Dr. Joe Dispenza';
const placeholder = '';

export const meditationMap: MeditationMap = {
  [MeditationKeys.NewPotentials]: {
    artist,
    formattedDuration: placeholder,
    id: placeholder,
    group: MeditationGroup.NewPotential,
    meditationId: MeditationKeys.NewPotentials,
    name: 'Tuning Into New Potentials',
    size: MeditationSizes.NewPotentials,
    url: require('../tracks/56004113.mp3'),
  },
  [MeditationKeys.NewPotentialsBreath]: {
    artist,
    formattedDuration: placeholder,
    id: placeholder,
    group: MeditationGroup.NewPotential,
    meditationId: MeditationKeys.NewPotentialsBreath,
    name: 'Tuning Into New Potentials - Breath',
    size: MeditationSizes.NewPotentialsBreath,
    url: require('../tracks/9674897.mp3'),
  },
  [MeditationKeys.BreakingTheHabit]: {
    artist,
    formattedDuration: placeholder,
    id: placeholder,
    group: MeditationGroup.BreakingHabit,
    meditationId: MeditationKeys.BreakingTheHabit,
    name: 'Breaking The Habit Of Being Yourself',
    size: MeditationSizes.BreakingTheHabit,
    url: require('../tracks/149360649.m4a'),
  },
  ['140710975']: {
    artist,
    formattedDuration: placeholder,
    id: placeholder,
    group: MeditationGroup.BreakingHabit,
    meditationId: MeditationKeys.BreakingTheHabitWater,
    name: 'Breaking The Habit Of Being Yourself - Water',
    size: MeditationSizes.BreakingTheHabitWater,
    url: require('../tracks/140710975.m4a'),
  },
}
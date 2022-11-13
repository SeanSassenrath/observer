import { DocumentPickerResponse } from "react-native-document-picker";
import { Meditation } from "../types";

export enum MeditationKeyss {
  NewPotentialsOne = '56004113',
  NewPotentialsOneBreath = '9674897',
  BreakingTheHabitOne = '149360649',
  BreakingTheHabitWaterOne = '140710975',
}

export enum MeditationSizes {
  NewPotentials = 56004113,
  NewPotentialsBreath = 9674897,
  BreakingTheHabit = 149360649,
  BreakingTheHabitWater = 140710975,
}

export const getMeditationName = (size: number) => {
  switch (size) {
    case MeditationSizes.NewPotentials:
      return 'Tuning Into New Potentials'
    case MeditationSizes.NewPotentialsBreath:
      return 'Tuning Into New Potentials - Breath'
    case MeditationSizes.BreakingTheHabit:
      return 'Breaking The Habit Of Being Yourself'
    case MeditationSizes.BreakingTheHabitWater:
      return 'Breaking The Habit Of Being Yourself - Water'
    default:
      return 'Name not found'
  }
}

const normalizeMeditation = (file: DocumentPickerResponse) => {
  if (!file.size) { return null; }

  const key = JSON.stringify(file.size);

  return ({
    artist: 'Dr Joe Dispenza',
    name: getMeditationName(file.size),
    id: key,
    size: file.size,
  })
}

export const normalizeMeditationData = (files: DocumentPickerResponse[]) => {
  const normalizedMeditations: Meditation[] = []
  const errors: DocumentPickerResponse[] = [];

  files.map((file) => {
    const normalizedMeditation = normalizeMeditation(file);

    if (normalizedMeditation === null || normalizedMeditation === undefined) {
      errors.push(file);
    } else {
      normalizedMeditations.push(normalizedMeditation);
    }
  })

  return { normalizedMeditations, errors };
};

export const getMeditation = (id: string, meditations: Meditation[]) =>
  meditations.find(meditation => meditation.id === id);

interface TrackURL {
  url: any;
}

interface TrackURLMap {
  [key: string]: TrackURL,
} 

const trackURLMap: TrackURLMap = {
  ['9674897']: {
    url: require('../tracks/9674897.mp3'),
  },
  ['56004113']: {
    url: require('../tracks/56004113.mp3'),
  },
  ['149360649']: {
    url: require('../tracks/149360649.m4a'),
  },
  ['140710975']: {
    url: require('../tracks/140710975.m4a'),
  },
}

export const getTrackURL = (key: string) => trackURLMap[key];

// file picker
// map over files
// if size matches a meditation key
  // normalize the data and push into a new success array
// if size does not match a mediation key
  // push file into a new error array
  // show users file names that did not match

// new async storage data
// map over files
// create a new object
// keyed off of size
  // name, size, key

// tracks
// create a map of tracks
// switch statement based off of key
// require local files

// meditations section
// show all supported meditations
// show unlocked meditations as normal
  // take user to meditation screen
// show locked meditations as disabled
  // take user to sync or buy screen
// sort by
  // unlocked
  // most recently used
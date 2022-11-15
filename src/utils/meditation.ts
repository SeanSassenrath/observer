import { Meditation } from "../types";

// export const getMeditationName = (size: number) => {
//   switch (size) {
//     case MeditationSizes.NewPotentials:
//       return 'Tuning Into New Potentials'
//     case MeditationSizes.NewPotentialsBreath:
//       return 'Tuning Into New Potentials - Breath'
//     case MeditationSizes.BreakingTheHabit:
//       return 'Breaking The Habit Of Being Yourself'
//     case MeditationSizes.BreakingTheHabitWater:
//       return 'Breaking The Habit Of Being Yourself - Water'
//     default:
//       return 'Name not found'
//   }
// }

export const getMeditation = (id: string, meditations: Meditation[]) =>
  meditations.find(meditation => meditation.id === id);

// interface TrackURL {
//   url: any;
// }

// interface MeditationMap {
//   [key: string]: Meditation,
// }

// export const getTrackURL = (key: string) => meditationMap[key];

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
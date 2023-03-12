import AsyncStorage from '@react-native-async-storage/async-storage';

const storageKey = '@meditation_file_path_data';

export interface MeditationFilePathData {
  [key: string]: string;
}

export const setMeditationFilePathDataInAsyncStorage = async (
  meditationFilePathData: MeditationFilePathData,
) => {
  try {
    console.log('ASYNC STORAGE: meditationFilePathData', meditationFilePathData);
    const stringifiedData = JSON.stringify({ ...meditationFilePathData });
    console.log('ASYNC STORAGE: Setting file path data', stringifiedData);
    if (stringifiedData !== null && stringifiedData !== undefined) {
      await AsyncStorage.setItem(storageKey, stringifiedData)
    }
  } catch (e) {
    // TODO: Add monitoring here
    console.log('ASYNC STORAGE ERROR: Setting file path data', e);
  }
}

export const getMeditationFilePathDataInAsyncStorage = async () => {
  try {
    const meditationFilePathData = await AsyncStorage.getItem(storageKey);
    // console.log('ASYNC STORAGE: Getting file path data', meditationFilePathData);
    return meditationFilePathData;
  } catch (e) {
    // console.log('ASYNC STORAGE ERROR: Getting file path data', e);
  }
}

export const removeMeditationFilePathDataInAsyncStorage = async () => {
  try {
    await AsyncStorage.removeItem(storageKey);
    console.log('ASYNC STORAGE: Removing file path data');
  } catch (e) {
    console.log('ASYNC STORAGE ERROR: Removing file path data', e)
  }
}

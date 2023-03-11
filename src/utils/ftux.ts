import AsyncStorage from "@react-native-async-storage/async-storage";
import { ftuxStorageKey } from "../contexts/ftuxData";


export const setFtuxStateInAsyncStorage = async () => {
  try {
    const value = 'true';
    await AsyncStorage.setItem(ftuxStorageKey, value);
  } catch (e) {
    console.log('Error with setting ftux data to Async Storage', e);
  }
}

export const getFtuxStateInAsyncStorage = async () => {
  try {
    const value = await AsyncStorage.getItem(ftuxStorageKey);
    return value === 'true';
  } catch (e) {
    console.log('Error with getting ftux data to Async Storage', e);
  }
}

export const removeFtuxStateFromAsyncStorage = async () => {
  try {
    await AsyncStorage.removeItem(ftuxStorageKey)
    const storageKeys = await AsyncStorage.getAllKeys();
    console.log('AsyncStorage after removing ftux', storageKeys)
  } catch (e) {
    console.log('error removing ftux data from storage', e)
  }
}

import AsyncStorage from '@react-native-async-storage/async-storage';

/*

App State - Notification Enabled

*/

const storageKey = '@has_notifications_enabled';

export const setIsNotificationsEnabledAsyncStorage = async (
  isEnabled: boolean,
) => {
  try {
    console.log(
      'ASYNC STORAGE: JS Timestamp for notification modal',
      isEnabled,
    );
    const stringifiedData = JSON.stringify({isEnabled});
    console.log(
      'ASYNC STORAGE: Setting has seen notification modal timestamp',
      stringifiedData,
    );
    if (stringifiedData !== null && stringifiedData !== undefined) {
      await AsyncStorage.setItem(storageKey, stringifiedData);
    }
  } catch (e) {
    // TODO: Add monitoring here
    console.log('ASYNC STORAGE ERROR: Setting notification enabled', e);
  }
};

export const getIsNotificationsEnabledAsyncStorage = async () => {
  try {
    const isEnabledString = await AsyncStorage.getItem(storageKey);

    if (isEnabledString) {
      const isEnabled = JSON.parse(isEnabledString);
      console.log('ASYNC STORAGE: Getting notification enabled', isEnabled);

      return isEnabled;
    }
  } catch (e) {
    // TODO: Add monitoring here
    console.log('ASYNC STORAGE ERROR: Getting notification enabled', e);
  }
};

/*

App State - Notification Modal

*/
const notifModalStorageKey = '@has_seen_notification_modal';

export const setSeenNotificationModalInAsyncStorage = async (
  isoTimestamp: string,
) => {
  try {
    console.log(
      'ASYNC STORAGE: JS Timestamp for notification modal',
      isoTimestamp,
    );
    const stringifiedData = JSON.stringify({isoTimestamp});
    console.log(
      'ASYNC STORAGE: Setting has seen notification modal timestamp',
      stringifiedData,
    );
    if (stringifiedData !== null && stringifiedData !== undefined) {
      await AsyncStorage.setItem(notifModalStorageKey, stringifiedData);
    }
  } catch (e) {
    // TODO: Add monitoring here
    console.log('ASYNC STORAGE ERROR: Setting notification modal timestamp', e);
  }
};

export const getSeenNotificationModalInAsyncStorage = async () => {
  try {
    const isoTimestamp = await AsyncStorage.getItem(notifModalStorageKey);
    console.log(
      'ASYNC STORAGE: Getting notification modal timestamp',
      isoTimestamp,
    );

    return isoTimestamp;
  } catch (e) {
    // TODO: Add monitoring here
    console.log('ASYNC STORAGE ERROR: Getting notification modal timestamp', e);
  }
};

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Playlist, PlaylistId} from '../types';

const PLAYLISTS_KEY = '@playlists';

/**
 * Get all playlists from AsyncStorage
 */
export const getPlaylistsFromAsyncStorage = async (): Promise<
  Record<PlaylistId, Playlist>
> => {
  try {
    const playlistsString = await AsyncStorage.getItem(PLAYLISTS_KEY);
    return playlistsString ? JSON.parse(playlistsString) : {};
  } catch (error) {
    console.error('Error reading playlists from AsyncStorage:', error);
    return {};
  }
};

/**
 * Save playlists to AsyncStorage
 */
export const setPlaylistsInAsyncStorage = async (
  playlists: Record<PlaylistId, Playlist>,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
  } catch (error) {
    console.error('Error saving playlists to AsyncStorage:', error);
  }
};

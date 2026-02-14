import firestore from '@react-native-firebase/firestore';
import {Playlist, PlaylistId} from '../types';

/**
 * Get all playlists for a user
 */
export const fbGetUserPlaylists = async (
  userId: string,
): Promise<Record<PlaylistId, Playlist>> => {
  try {
    const snapshot = await firestore()
      .collection('users')
      .doc(userId)
      .collection('playlists')
      .get();

    const playlists: Record<PlaylistId, Playlist> = {};
    snapshot.forEach(doc => {
      playlists[doc.id] = {
        ...doc.data(),
        playlistId: doc.id,
      } as Playlist;
    });

    return playlists;
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return {};
  }
};

/**
 * Create a new playlist
 */
export const fbCreatePlaylist = async (
  userId: string,
  playlist: Omit<Playlist, 'playlistId' | 'createdAt' | 'updatedAt'>,
): Promise<string> => {
  try {
    const timestamp = Date.now();
    const docRef = await firestore()
      .collection('users')
      .doc(userId)
      .collection('playlists')
      .add({
        ...playlist,
        createdAt: timestamp,
        updatedAt: timestamp,
        lastInteractedAt: timestamp,
      });

    return docRef.id;
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
};

/**
 * Update an existing playlist
 */
export const fbUpdatePlaylist = async (
  userId: string,
  playlistId: PlaylistId,
  updates: Partial<Playlist>,
): Promise<void> => {
  try {
    await firestore()
      .collection('users')
      .doc(userId)
      .collection('playlists')
      .doc(playlistId)
      .update({
        ...updates,
        updatedAt: Date.now(),
      });
  } catch (error) {
    console.error('Error updating playlist:', error);
    throw error;
  }
};

/**
 * Delete a playlist
 */
export const fbDeletePlaylist = async (
  userId: string,
  playlistId: PlaylistId,
): Promise<void> => {
  try {
    await firestore()
      .collection('users')
      .doc(userId)
      .collection('playlists')
      .doc(playlistId)
      .delete();
  } catch (error) {
    console.error('Error deleting playlist:', error);
    throw error;
  }
};

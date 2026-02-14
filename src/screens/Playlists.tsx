import React, {useContext} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Layout, Text, Icon, Button} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';

import PlaylistContext from '../contexts/playlist';
import MeditationBaseDataContext from '../contexts/meditationBaseData';
import {Playlist, PlaylistId} from '../types';
import {brightWhite} from '../constants/colors';
import _Button from '../components/Button';

const COLOR_PRIMARY = '#9C4DCC';

const Playlists = () => {
  const navigation = useNavigation();
  const {playlists} = useContext(PlaylistContext);
  const {meditationBaseData} = useContext(MeditationBaseDataContext);

  const playlistsArray = Object.values(playlists).sort(
    (a, b) =>
      (b.lastInteractedAt ?? b.updatedAt ?? b.createdAt ?? 0) -
      (a.lastInteractedAt ?? a.updatedAt ?? a.createdAt ?? 0),
  );

  const calculatePlaylistDuration = (playlist: Playlist): number => {
    // Calculate total duration in minutes from meditation IDs
    let totalMinutes = 0;
    playlist.meditationIds.forEach(medId => {
      const meditation = meditationBaseData[medId];
      if (meditation && meditation.formattedDuration) {
        const duration = meditation.formattedDuration;

        // Try to match formatted duration (e.g., "45 min" or "1 hr 15 min")
        const minutesMatch = duration.match(/(\d+)\s*min/);
        const hoursMatch = duration.match(/(\d+)\s*hr/);

        if (minutesMatch || hoursMatch) {
          if (minutesMatch) {
            totalMinutes += parseInt(minutesMatch[1], 10);
          }
          if (hoursMatch) {
            totalMinutes += parseInt(hoursMatch[1], 10) * 60;
          }
        } else {
          // Handle plain number format (e.g., "45")
          const plainNumber = parseInt(duration, 10);
          if (!isNaN(plainNumber)) {
            totalMinutes += plainNumber;
          }
        }
      }
    });
    return totalMinutes;
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
  };

  const handleCreatePlaylist = () => {
    // @ts-ignore
    navigation.navigate('CreatePlaylist');
  };

  const handlePlaylistPress = (playlistId: PlaylistId) => {
    // @ts-ignore
    navigation.navigate('PlaylistPreparation', {playlistId});
  };

  const handleEditPlaylist = (playlistId: PlaylistId) => {
    // @ts-ignore
    navigation.navigate('EditPlaylist', {playlistId});
  };

  const renderPlaylistCard = ({item}: {item: Playlist}) => {
    const duration = calculatePlaylistDuration(item);
    const trackCount = item.meditationIds.length;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handlePlaylistPress(item.playlistId)}>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text category="h6" style={styles.playlistName}>
              {item.name}
            </Text>
            <TouchableOpacity
              onPress={() => handleEditPlaylist(item.playlistId)}
              style={styles.menuButton}>
              <Icon
                name="more-vertical-outline"
                fill={brightWhite}
                style={styles.menuIcon}
              />
            </TouchableOpacity>
          </View>

          {item.description && (
            <Text category="p2" style={styles.description}>
              {item.description}
            </Text>
          )}

          <View style={styles.cardFooter}>
            <Text category="c1" style={styles.metaText}>
              {trackCount} {trackCount === 1 ? 'track' : 'tracks'} • {formatDuration(duration)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <Layout style={styles.emptyContainer}>
      <Icon
        name="list-outline"
        fill="#6B7280"
        style={styles.emptyIcon}
      />
      <Text category="h6" style={styles.emptyTitle}>
        No playlists yet
      </Text>
      <Text category="p2" style={styles.emptyDescription}>
        Create your first playlist to sequence meditations for a perfect session.
      </Text>
      <_Button
        style={styles.emptyButton}
        onPress={handleCreatePlaylist}>
        Create a Playlist
      </_Button>
    </Layout>
  );

  return (
    <Layout level="4" style={styles.rootContainer}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text category="h3" style={styles.title}>
              Playlists
            </Text>
            <Text category="p2" style={styles.subtitle}>
              Your meditation collections
            </Text>
          </View>
          {playlistsArray.length > 0 && (
            <TouchableOpacity
              onPress={handleCreatePlaylist}
              style={styles.addButton}>
              <Icon
                name="plus"
                fill={COLOR_PRIMARY}
                style={styles.addIcon}
              />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={playlistsArray}
          renderItem={renderPlaylistCard}
          keyExtractor={item => item.playlistId}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={
            playlistsArray.length === 0
              ? styles.emptyListContainer
              : styles.listContainer
          }
        />
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  layout: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  title: {
    color: brightWhite,
    marginBottom: 4,
  },
  subtitle: {
    color: '#9CA3AF',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(156, 77, 204, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    width: 24,
    height: 24,
  },
  listContainer: {
    paddingBottom: 100,
    marginHorizontal: 20,
    marginTop: 40,
  },
  emptyListContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  playlistName: {
    color: brightWhite,
    flex: 1,
    marginRight: 8,
  },
  menuButton: {
    padding: 4,
  },
  menuIcon: {
    width: 20,
    height: 20,
  },
  description: {
    color: '#9CA3AF',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaText: {
    color: '#6B7280',
  },
  playIcon: {
    width: 28,
    height: 28,
  },
  emptyContainer: {
    // flex: 1,
    // justifyContent: 'center',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 60,
    padding: 20,
    marginHorizontal: 20,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    color: brightWhite,
    marginBottom: 8,
  },
  emptyDescription: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    minWidth: 200,
  },
  rootContainer: {
    flex: 1,
  },
});

export default Playlists;

import React, {useContext} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Layout, Text} from '@ui-kitten/components';

import {PlaylistCard} from './PlaylistCard';
import {Playlist, PlaylistId} from '../types';
import MeditationBaseDataContext from '../contexts/meditationBaseData';
import {playlistGradients} from '../constants/colors';

interface PlaylistListProps {
  header: string;
  playlists: Playlist[];
  onPlaylistPress(id: PlaylistId): void;
  maxItems?: number;
}

export const PlaylistList = ({
  header,
  playlists,
  onPlaylistPress,
  maxItems = 5,
}: PlaylistListProps) => {
  const {meditationBaseData} = useContext(MeditationBaseDataContext);

  const calculateTotalDuration = (meditationIds: string[]): number => {
    let totalMinutes = 0;
    meditationIds.forEach(medId => {
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

  const displayedPlaylists = playlists.slice(0, maxItems);

  return (
    <Layout style={styles.container} key={header}>
      <Text category="h6" style={styles.header}>
        {header}
      </Text>
      <ScrollView horizontal={true} style={styles.horizontalContainer} showsHorizontalScrollIndicator={false}>
        {displayedPlaylists.map((playlist, index) => {
          const duration = calculateTotalDuration(playlist.meditationIds);
          const trackCount = playlist.meditationIds.length;

          return (
            <PlaylistCard
              key={playlist.playlistId}
              playlistId={playlist.playlistId}
              name={playlist.name}
              trackCount={trackCount}
              totalDuration={formatDuration(duration)}
              gradientColors={playlistGradients[index % playlistGradients.length]}
              onPress={onPlaylistPress}
            />
          );
        })}
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    marginBottom: 60,
  },
  header: {
    opacity: 0.8,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  horizontalContainer: {
    paddingLeft: 20,
    paddingRight: 100,
  },
});

import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Text} from '@ui-kitten/components';
import LinearGradient from 'react-native-linear-gradient';

import {PlaylistId} from '../types';

interface PlaylistCardProps {
  playlistId: PlaylistId;
  name: string;
  trackCount: number;
  totalDuration: string;
  gradientColors: string[];
  onPress(id: PlaylistId): void;
}

export const PlaylistCard = (props: PlaylistCardProps) => (
  <Pressable
    key={props.playlistId}
    onPress={() => props.onPress(props.playlistId)}>
    <LinearGradient
      colors={props.gradientColors}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.card}>
      <View style={styles.nameContainer}>
        <Text category="s1" style={styles.nameText}>
          {props.name}
        </Text>
      </View>
      <View style={styles.metaContainer}>
        <Text category="s2" style={styles.metaText}>
          {props.trackCount} {props.trackCount === 1 ? 'track' : 'tracks'} • {props.totalDuration}
        </Text>
      </View>
    </LinearGradient>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    height: 120,
    marginRight: 12,
    width: 200,
    padding: 16,
    justifyContent: 'space-between',
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontWeight: '600',
  },
  metaContainer: {
    paddingTop: 8,
  },
  metaText: {
    opacity: 0.6,
  },
});

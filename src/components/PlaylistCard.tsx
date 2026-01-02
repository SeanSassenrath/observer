import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {Layout, Text} from '@ui-kitten/components';

import {PlaylistId} from '../types';

interface PlaylistCardProps {
  playlistId: PlaylistId;
  name: string;
  trackCount: number;
  totalDuration: string;
  onPress(id: PlaylistId): void;
}

export const PlaylistCard = (props: PlaylistCardProps) => (
  <Pressable
    key={props.playlistId}
    onPress={() => props.onPress(props.playlistId)}>
    <Layout level="2" style={styles.card}>
      <Layout level="2" style={styles.nameContainer}>
        <Text category="s1" style={styles.nameText}>
          {props.name}
        </Text>
      </Layout>
      <Layout level="2" style={styles.metaContainer}>
        <Text category="c1" style={styles.metaText}>
          {props.trackCount} {props.trackCount === 1 ? 'track' : 'tracks'} • {props.totalDuration}
        </Text>
      </Layout>
    </Layout>
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
    opacity: 0.7,
  },
});

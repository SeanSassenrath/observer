import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from '@ui-kitten/components';

const PlaylistPreparation = () => {
  return (
    <View style={styles.container}>
      <Text category="h1">Playlist Preparation</Text>
      <Text>Playlist preparation screen coming soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PlaylistPreparation;

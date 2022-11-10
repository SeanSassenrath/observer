import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Layout, Text } from '@ui-kitten/components';

import { MeditationPlayerScreenNavigationProp } from '../types';

const MeditationPlayer = () => {
  const navigation = useNavigation<MeditationPlayerScreenNavigationProp>();

  const onClosePress = () => {
    navigation.pop();
  }

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.topBar}>
          <Text category='h5' style={styles.topBarText}>Meditation Player</Text>
          <Button onPress={onClosePress}>Close</Button>
        </Layout>
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    padding: 20,
  },
  topBarText: {
    paddingBottom: 20,
  },
})

export default MeditationPlayer;
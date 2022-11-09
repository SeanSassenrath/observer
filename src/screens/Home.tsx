import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Layout, Text } from '@ui-kitten/components'; 

import { MeditationScreenNavigationProp } from '../types';

interface Meditation {
  name: string,
}

const meditations = [{
  name: 'Blessing of the energy centers'
}, {
  name: 'Tuning into new potentials'
}]

const HomeScreen = () => {
  const navigation = useNavigation<MeditationScreenNavigationProp>();

  const onMeditationClick = (meditation: Meditation) => {
    navigation.navigate('Meditation', {
      name: meditation.name,
    });
  }

  return (
    <SafeAreaView>
      <Text>Home</Text>
      <Layout style={styles.layout}>
        {meditations.map(meditation =>
          <Card
            key={meditation.name}
            onPress={() => onMeditationClick(meditation)}
            style={styles.card}
          >
            <Text>{meditation.name}</Text>
          </Card>
        )}
      </Layout>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  card: {
    width: 200,
  },
  layout: {
    flexDirection: 'row',
  }
})

export default HomeScreen;
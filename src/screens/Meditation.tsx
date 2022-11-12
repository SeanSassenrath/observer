import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
  Button,
  Icon,
  Layout,
  Text,
} from '@ui-kitten/components';


import { MeditationScreenNavigationProp, MeditationStackScreenProps } from '../types';
import MeditationDataContext from '../contexts/meditationData';
import { getMeditation } from '../utils/meditation';

const CloseIcon = (props: any) => (
  <Icon {...props} name='close-outline' />
);

const MeditationScreen = ({ route }: MeditationStackScreenProps<'Meditation'>) => {
  const { meditations } = useContext(MeditationDataContext);
  const navigation = useNavigation<MeditationScreenNavigationProp>();
  const { id } = route.params;

  const meditation = getMeditation(id, meditations)

  const onClosePress = () => {
    navigation.pop();
  }

  const onStartPress = () => {
    navigation.navigate('MeditationPlayer', { id });
  }

  if (!meditation) return null;

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.topBar}>
          <Text category='h4' style={styles.topBarText}>{meditation.name}</Text>
          <Button
            appearance='ghost'
            accessoryLeft={CloseIcon}
            onPress={onClosePress}
            style={styles.topBarIcon}
          />
        </Layout>
        <Layout style={styles.mainSection}>
          <Text category='s1'>Set intention</Text>
          <Text category='s1'>Turn on do not disturb</Text>
          <Text category='s1'>Take off watch</Text>
        </Layout>
        <Layout style={styles.bottomBar}>
          <Button onPress={onStartPress}>Start</Button>
        </Layout>
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  bottomBar: {
    flex: 1,
    padding: 20,
  },
  container: {
    flex: 1,
  },
  icon: {
    width: 32,
    height: 32,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  layout: {
    flexDirection: 'row-reverse',
  },
  mainSection: {
    padding: 20,
    flex: 6,
  },
  topBar: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingLeft: 20,
    paddingTop: 20,
    flex: 1,
  },
  topBarText: {
    flex: 9,
  },
  topBarIcon: {
    flex: 1
  }
})

export default MeditationScreen;
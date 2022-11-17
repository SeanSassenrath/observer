import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Button,
  Icon,
  Input,
  Layout,
  Text,
} from '@ui-kitten/components';

import _Button from '../components/Button';
import { MeditationScreenNavigationProp, MeditationStackScreenProps } from '../types';
import { meditationMap } from '../constants/meditation';

const CloseIcon = (props: any) => (
  <Icon {...props} name='close-outline' />
);

const WarningIcon = (props: any) => (
  <Icon {...props} style={styles.actionIcon} fill='#b2b2b2' name='bell-off-outline' />
);

const WatchIcon = (props: any) => (
  <Icon {...props} style={styles.actionIcon} fill='#b2b2b2' name='clock-outline' />
);

const MeditationScreen = ({ route }: MeditationStackScreenProps<'Meditation'>) => {
  const navigation = useNavigation<MeditationScreenNavigationProp>();
  const { id } = route.params;

  const meditation = meditationMap[id];

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
          <Layout style={styles.actionSection}>
            <WarningIcon />
            <Text category='h6' style={styles.actionText}>Turn on do not disturb</Text>
          </Layout>
          <Layout style={styles.actionSection}>
            <WatchIcon />
            <Text category='h6' style={styles.actionText}>Take off your watch</Text>
          </Layout>
          <Layout style={styles.actionSection}>
          </Layout>
        </Layout>
        <Layout style={styles.bottomBar}>
          <_Button onPress={onStartPress} size='large'>Start</_Button>
        </Layout>
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  actionSection: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    textAlign: 'center',
    paddingTop: 20,
  },
  actionIcon: {
    height: 50,
    width: 50,
    // textAlign: 'center',
  },
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
    justifyContent: 'center',
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
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
  Button,
  Icon,
  Layout,
  Text,
} from '@ui-kitten/components';


import { MeditationScreenNavigationProp, MeditationStackScreenProps } from '../types';

const CloseIcon = (props: any) => (
  <Icon {...props} name='close-outline' />
);

const MeditationScreen = ({ route }: MeditationStackScreenProps<'Meditation'>) => {
  const navigation = useNavigation<MeditationScreenNavigationProp>();

  const onClosePress = () => {
    navigation.pop();
  }

  const { name } = route.params;

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.container}>
          <Layout style={styles.layout}>
            <Button
              appearance='ghost'
              accessoryLeft={CloseIcon}
              onPress={onClosePress}
            />
          </Layout>
          <Layout style={styles.header}>
            <Text category='h5'>{name}</Text>
          </Layout>
        </Layout>
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
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
})

export default MeditationScreen;
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

const StarIcon = (props: any) => (
  <Icon {...props} name='close-outline' />
);

const MeditationScreen = ({ route }: MeditationStackScreenProps<'Meditation'>) => {
  const { name } = route.params;

  const navigation = useNavigation<MeditationScreenNavigationProp>();

  const onClosePress = () => {
    navigation.pop();
  }

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.container}>
          <Layout style={styles.layout}>
            <Button
              appearance='ghost'
              accessoryLeft={StarIcon}
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
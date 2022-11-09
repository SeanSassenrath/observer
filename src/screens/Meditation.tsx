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
    <SafeAreaView style={styles.test}>
      <Layout style={styles.container}>
        <Layout style={styles.layout}>
          <Button
            appearance='ghost'
            accessoryLeft={StarIcon}
            onPress={onClosePress}
          />
        </Layout>
        <Layout>
          <Text>Meditation</Text>
          <Text>{name}</Text>
        </Layout>
      </Layout>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  test: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  icon: {
    width: 32,
    height: 32,
  },
  layout: {
    flexDirection: 'row-reverse',
  },
})

export default MeditationScreen;
import { useNavigation } from '@react-navigation/native';
import { Layout, Text } from '@ui-kitten/components';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import _Button from '../components/Button';
import { MeditationFinishScreenNavigationProp } from '../types';

const MeditationFinishScreen = () => {
  const navigation = useNavigation<MeditationFinishScreenNavigationProp>();

  const onDonePress = () => {
    navigation.navigate('TabNavigation')
  }

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.contentContainer}>
          <Text category='s1' style={styles.text}>What does this screen look like?</Text>
          <_Button
            onPress={onDonePress}
            style={styles.doneButton}
          >
            DONE
          </_Button>
        </Layout>
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  doneButton: {
    marginTop: 20,
  },
  text: {
    marginVertical: 20,
  }
})

export default MeditationFinishScreen;

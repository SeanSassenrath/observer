import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { Layout, Text } from '@ui-kitten/components';

import _Button from '../components/Button';
import { MultiLineInput } from '../components/MultiLineInput';
import { MeditationFinishScreenNavigationProp } from '../types';
import { MeditationFeedbackCard } from '../components/MeditationFeedbackCard';

const EMPTY_INPUT = '';

const MeditationFinishScreen = () => {
  const navigation = useNavigation<MeditationFinishScreenNavigationProp>();
  const [firstInput, setFirstInput] = useState(EMPTY_INPUT)
  const [secondInput, setSecondInput] = useState(EMPTY_INPUT)

  const onDonePress = () => {
    navigation.navigate('TabNavigation')
  }

  return (
    <Layout style={styles.rootContainer} level='4'>
      <ScrollView style={styles.scrollContainer}>
        <SafeAreaView>
          <Layout style={styles.contentContainer} level='4'>
            <Text category='h5' style={styles.text}>Welcome back</Text>
            <MeditationFeedbackCard />
            <MultiLineInput
              onChangeText={setFirstInput}
              placeholder='What feelings did you embody?'
              value={firstInput}
              style={styles.input}
            />
            <MultiLineInput
              onChangeText={setFirstInput}
              placeholder='What do you want to focus on next time?'
              value={firstInput}
              style={styles.input}
            />
          </Layout>
        </SafeAreaView>
      </ScrollView>
      <Layout level='4' style={styles.bottomBarContainer}>
        <_Button
          onPress={onDonePress}
          style={styles.doneButton}
        >
          DONE
        </_Button>
      </Layout>
    </Layout>
  )
}

const styles = StyleSheet.create({
  bottomBarContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  rootContainer: {
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
  scrollContainer: {
    flex: 1,
  },
  text: {
    marginTop: 20,
    marginBottom: 40,
  },
  input: {
    marginBottom: 60,
  }
})

export default MeditationFinishScreen;

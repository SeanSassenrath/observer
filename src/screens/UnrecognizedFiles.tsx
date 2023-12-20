import React from 'react';
import {Layout, Text} from '@ui-kitten/components';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Button from '../components/Button';
import {
  AddMedsMatchingScreenNavigationProp,
  AddMedsMatchingScreenRouteProp,
} from '../types';

interface Props {
  navigation: AddMedsMatchingScreenNavigationProp;
  route: AddMedsMatchingScreenRouteProp;
}

const UnrecognizedFilesScreen = (props: Props) => {
  const {route} = props;
  const {medsFail} = route.params;

  const navigation = useNavigation();

  const onNextPress = () => {
    console.log('test');
  };

  const unrecognizedFilesCount = medsFail.length;
  const isLengthOne = unrecognizedFilesCount === 1;

  return (
    <Layout level="4" style={styles.rootContainer}>
      <SafeAreaView style={styles.container}>
        <View style={styles.top} />
        <View style={styles.middle}>
          <Text category="h3" style={styles.header}>
            Unrecognized {isLengthOne ? 'File' : 'Files'}
          </Text>
          <Text category="s1" style={styles.description}>
            We weren't able to recognize {unrecognizedFilesCount} of the files
            you added. Let's fix {isLengthOne ? 'it' : 'them'}.
          </Text>
        </View>
        <View style={styles.bottom}>
          <Button size="large" onPress={onNextPress} style={styles.addButton}>
            Continue
          </Button>
        </View>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  addButton: {
    color: 'white',
    marginBottom: 16,
  },
  bottom: {
    justifyContent: 'flex-end',
    flex: 2,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 20,
    textAlign: 'center',
  },
  description: {
    lineHeight: 24,
    textAlign: 'center',
  },
  middle: {
    flex: 4,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  rootContainer: {
    flex: 1,
  },
  skipButton: {
    color: 'white',
  },
  top: {
    flex: 3,
    paddingHorizontal: 20,
  },
});

export default UnrecognizedFilesScreen;

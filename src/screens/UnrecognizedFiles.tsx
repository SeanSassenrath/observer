import React from 'react';
import {Layout, Text} from '@ui-kitten/components';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Button from '../components/Button';
import {
  UnrecognizedFilesScreenNavigationProp,
  UnrecognizedFilesScreenRouteProp,
} from '../types';

interface Props {
  navigation: UnrecognizedFilesScreenNavigationProp;
  route: UnrecognizedFilesScreenRouteProp;
}

const UnrecognizedFilesScreen = (props: Props) => {
  const {route} = props;
  const {medsFail} = route.params;

  const navigation = useNavigation();

  const onContinuePress = () => {
    navigation.navigate('MeditationMatch', {
      medsFail: medsFail,
    });
  };

  const unrecognizedFilesCount = medsFail.length;
  const isLengthOne = unrecognizedFilesCount === 1;

  return (
    <Layout level="4" style={styles.rootContainer}>
      <SafeAreaView style={styles.container}>
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
          <Button
            size="large"
            onPress={onContinuePress}
            style={styles.addButton}>
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
    flex: 1,
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
    flex: 9,
    justifyContent: 'center',
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

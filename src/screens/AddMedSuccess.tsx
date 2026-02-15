import React, {useContext, useEffect} from 'react';
import {Layout, Icon, Text, useStyleSheet} from '@ui-kitten/components';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {usePostHog} from 'posthog-react-native';

import Button from '../components/Button';
import {useNavigation} from '@react-navigation/native';
import {successGreen} from '../constants/colors';
import {makeMeditationBaseData} from '../utils/meditation';
import MeditationBaseDataContext from '../contexts/meditationBaseData';
import {captureAddFlowEvent} from '../analytics/posthog';

const SuccessIcon = (props: any) => (
  <Icon
    {...props}
    style={iconStyles.successIcon}
    fill={successGreen}
    name="checkmark-circle-2-outline"
  />
);

const iconStyles = StyleSheet.create({
  successIcon: {
    height: 50,
    width: 50,
    marginBottom: 20,
  },
});

const AddMedsSuccessScreen = () => {
  const posthog = usePostHog();
  const {setMeditationBaseData} = useContext(MeditationBaseDataContext);
  const styles = useStyleSheet(themedStyles);

  const navigation = useNavigation();

  const addMeditationsToContext = async () => {
    const _meditationBaseData = await makeMeditationBaseData();
    if (_meditationBaseData && Object.keys(_meditationBaseData).length > 0) {
      setMeditationBaseData(_meditationBaseData);
    }
  };

  useEffect(() => {
    captureAddFlowEvent(posthog, 'add_meditation_completed');
    addMeditationsToContext();
  }, []);

  const onContinuePress = async () => {
    //@ts-ignore
    navigation.navigate('TabNavigation', {screen: 'Home'});
  };

  return (
    <Layout level="4" style={styles.rootContainer}>
      <SafeAreaView style={styles.container}>
        <View style={styles.middle}>
          <SuccessIcon />
          <Text category="h3" style={styles.header}>
            Meditations Successfully Added
          </Text>
          <Text category="s1" style={styles.description}>
            Nicely done!
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

const themedStyles = StyleSheet.create({
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
    alignItems: 'center',
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

export default AddMedsSuccessScreen;

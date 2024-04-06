import {Button, Layout, Text, useStyleSheet} from '@ui-kitten/components';
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';

import MeditationHistoryContext from '../contexts/meditationHistory';
import {
  getLastMeditationInstance,
  getMeditationFromId,
} from '../utils/meditations/meditations';
import UserContext from '../contexts/userData';
import {getIsSubscribed} from '../utils/user/user';

const MESSAGE_INDEX = 0;

const initialHeaderList = 'Welcome!';
const initialDescriptionList =
  'Easily find and play meditations, add breathwork before meditations, and gain insights into your practice.';

const headerList = ['Share with a friend'];
const descriptionList = [
  'Know someone who would benefit from taking their practice to the next level?',
];
const ctaButton = ['Send invitation'];

/*

This component is used for the initial welcome message and to show messages for unsubscribed users

*/

export const Inspiration = () => {
  const styles = useStyleSheet(themedStyles);

  const {meditationHistory} = useContext(MeditationHistoryContext);
  const {user} = useContext(UserContext);

  const [messageIndex, setMessageIndex] = useState(0);

  const lastMeditationInstance = getLastMeditationInstance(meditationHistory);
  const lastMeditation =
    lastMeditationInstance &&
    getMeditationFromId(lastMeditationInstance.meditationBaseId);
  const hasLastMeditation = lastMeditationInstance && lastMeditation;

  const isInitialWelcome = !hasLastMeditation;
  const isSubscribed = getIsSubscribed(user);

  const setMessage = () => {
    setMessageIndex(MESSAGE_INDEX);
  };

  useEffect(() => {
    setMessage();
  }, []);

  const getHeader = () => {
    if (isInitialWelcome) {
      return initialHeaderList;
    } else {
      return headerList[messageIndex];
    }
  };

  const getDescription = () => {
    if (isInitialWelcome) {
      return initialDescriptionList;
    } else {
      return descriptionList[messageIndex];
    }
  };

  const getCtaButton = () => {
    return ctaButton[messageIndex];
  };

  if (!isInitialWelcome) {
    return <></>;
  }

  return (
    <Layout level="2" style={styles.container}>
      <Text category="h6" style={styles.header}>
        {getHeader()}
      </Text>
      <Text category="s1" style={styles.prompt}>
        {getDescription()}
      </Text>
      {!isInitialWelcome ? (
        <Button
          onPress={() => {}}
          appearance="outline"
          status="basic"
          style={styles.button}>
          {getCtaButton()}
        </Button>
      ) : null}
    </Layout>
  );
};

const themedStyles = StyleSheet.create({
  button: {
    marginTop: 20,
    borderRadius: 50,
  },
  container: {
    backgroundColor: 'rgba(48,55,75,0.6)',
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 10,
  },
  header: {
    marginBottom: 10,
    opacity: 0.7,
  },
  prompt: {
    lineHeight: 24,
    opacity: 0.7,
  },
});

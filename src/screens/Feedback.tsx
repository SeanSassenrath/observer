import {Button, Icon, Input, Layout, Text} from '@ui-kitten/components';
import React, {useContext, useState} from 'react';
import {Pressable, SafeAreaView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {brightWhite} from '../constants/colors';
import UserContext from '../contexts/userData';
import {fbSendFeedback} from '../fb/feedback';
import Toast from 'react-native-toast-message';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const EMPTY_STRING = '';

const BackIcon = (props: any) => (
  <Icon
    {...props}
    style={iconStyles.backIcon}
    fill={brightWhite}
    name="arrow-back-outline"
  />
);

const FeedbackScreen = () => {
  const {user} = useContext(UserContext);
  const [subject, setSubject] = useState(EMPTY_STRING);
  const [feedback, setFeedback] = useState(EMPTY_STRING);

  const navigation = useNavigation();

  const onSubmitPress = async () => {
    const isSuccessful = await fbSendFeedback(user, subject, feedback);

    if (isSuccessful) {
      setSubject(EMPTY_STRING);
      setFeedback(EMPTY_STRING);

      Toast.show({
        type: 'success',
        text1: 'Feedback sent',
        text2: 'Thank you!',
        position: 'bottom',
        bottomOffset: 100,
      });

      navigation.goBack();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Feedback not sent',
        text2: 'Please try again',
        position: 'bottom',
        bottomOffset: 100,
      });
    }
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  return (
    <Layout level="4" style={styles.rootContainer}>
      <SafeAreaView style={styles.safeAreaView}>
        <KeyboardAwareScrollView>
          <View style={styles.topContainer}>
            <Pressable onPress={onBackPress}>
              <BackIcon />
            </Pressable>
          </View>
          <View style={styles.middleContainer}>
            <View style={styles.textContainer}>
              <Text category="h6" style={styles.textHeader}>
                We'd love to hear from you!
              </Text>
              <Text>
                Please let us know if you have any questions or feedback.
              </Text>
            </View>
            <Input
              value={subject}
              placeholder="Subject"
              onChangeText={setSubject}
              style={styles.input}
              textStyle={styles.subjectTextInput}
            />
            <Input
              multiline
              onChangeText={setFeedback}
              placeholder="Add your questions or feedback here"
              style={styles.input}
              textStyle={styles.feedbackTextInput}
              value={feedback}
            />
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.bottomContainer}>
          <Button
            size="large"
            style={styles.submitButton}
            onPress={onSubmitPress}>
            Submit
          </Button>
        </View>
      </SafeAreaView>
    </Layout>
  );
};

const iconStyles = StyleSheet.create({
  backIcon: {
    height: 40,
    width: 40,
  },
});

const styles = StyleSheet.create({
  bottomContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  middleContainer: {
    flex: 8,
    paddingHorizontal: 20,
  },
  feedbackTextInput: {
    paddingVertical: 8,
    fontSize: 18,
    borderRadius: 20,
    height: 300,
  },
  rootContainer: {
    flex: 1,
  },
  input: {
    borderRadius: 10,
    borderColor: 'transparent',
    paddingVertical: 10,
  },
  safeAreaView: {
    flex: 1,
  },
  subjectTextInput: {
    paddingVertical: 8,
    fontSize: 18,
    borderRadius: 20,
  },
  submitButton: {
    borderRadius: 50,
  },
  textContainer: {
    marginBottom: 30,
  },
  textHeader: {
    marginBottom: 10,
  },
  topContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 40,
    marginTop: 10,
  },
});

export default FeedbackScreen;

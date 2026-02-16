import React, {useContext, useState} from 'react';
import {Pressable, SafeAreaView, StyleSheet, View} from 'react-native';
import {Icon, Input, Layout, Text, useStyleSheet} from '@ui-kitten/components';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {brightWhite} from '../constants/colors';
import {StackParamList} from '../types';
import UserContext from '../contexts/userData';
import {fbSubmitMeditationRequest} from '../fb/submissions';
import Button from '../components/Button';

const EMPTY_STRING = '';

const BackIcon = (props: any) => (
  <Icon
    {...props}
    style={iconStyles.backIcon}
    fill={brightWhite}
    name="arrow-back-outline"
  />
);

const SubmitMeditationScreen = () => {
  const {user} = useContext(UserContext);
  const navigation = useNavigation();
  const route = useRoute<RouteProp<StackParamList, 'SubmitMeditation'>>();

  const {fileName, fileSize, fileType, medsFail, currentFileIndex} =
    route.params;

  const [meditationName, setMeditationName] = useState(EMPTY_STRING);
  const [author, setAuthor] = useState(EMPTY_STRING);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const styles = useStyleSheet(themedStyles);

  const isFormValid = meditationName.trim().length > 0;

  const onBackPress = () => {
    navigation.goBack();
  };

  const onSubmitPress = async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);

    const success = await fbSubmitMeditationRequest(user, {
      fileName,
      fileSize,
      fileType,
      suggestedName: meditationName.trim(),
      suggestedArtist: author.trim() || 'Dr. Joe Dispenza',
    });

    setIsSubmitting(false);

    if (success) {
      Toast.show({
        type: 'success',
        text1: 'Request submitted',
        text2: "We'll review your request soon",
        position: 'bottom',
        bottomOffset: 100,
      });

      const isLastFile =
        medsFail && currentFileIndex !== undefined
          ? currentFileIndex >= medsFail.length - 1
          : true;

      if (isLastFile) {
        navigation.navigate('AddMedsSuccess');
      } else {
        navigation.navigate('MeditationMatch', {
          medsFail,
          startIndex: currentFileIndex + 1,
        });
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Submission failed',
        text2: 'Please try again',
        position: 'bottom',
        bottomOffset: 100,
      });
    }
  };

  return (
    <Layout level="4" style={styles.screenContainer}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.topContainer}>
            <Pressable onPress={onBackPress}>
              <BackIcon />
            </Pressable>
          </View>
          <View style={styles.contentContainer}>
            <Text category="h5" style={styles.title}>
              Request Meditation
            </Text>
            <Text category="s2" style={styles.subtitle}>
              Let us know which meditation you'd like us to support.
            </Text>
            <Text category="s1" style={styles.fileName}>
              {fileName}
            </Text>

            <View style={styles.formContainer}>
              <Text category="s1" style={styles.label}>
                Meditation Name
              </Text>
              <Input
                value={meditationName}
                placeholder="e.g. Blessing of the Energy Centers 08"
                onChangeText={setMeditationName}
                style={styles.input}
                textStyle={styles.inputText}
              />

              <Text category="s1" style={styles.label}>
                Author
              </Text>
              <Input
                value={author}
                placeholder="e.g. Dr. Joe Dispenza"
                onChangeText={setAuthor}
                style={styles.input}
                textStyle={styles.inputText}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.bottomContainer}>
          <Button
            disabled={!isFormValid || isSubmitting}
            onPress={onSubmitPress}
            size="large">
            Submit Request
          </Button>
        </View>
      </SafeAreaView>
    </Layout>
  );
};

const iconStyles = StyleSheet.create({
  backIcon: {
    height: 30,
    width: 30,
  },
});

const themedStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  topContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  contentContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.7,
    lineHeight: 22,
  },
  fileName: {
    color: 'color-primary-200',
    marginTop: 4,
    marginBottom: 30,
  },
  formContainer: {},
  label: {
    marginBottom: 8,
  },
  input: {
    borderRadius: 10,
    borderColor: 'transparent',
    marginBottom: 20,
  },
  inputText: {
    paddingVertical: 8,
    fontSize: 16,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default SubmitMeditationScreen;

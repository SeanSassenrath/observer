import React, { useContext, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components/ui';
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';

//@ts-ignore
import videoFile from '../assets/app-tutorial-1-ios.mov';

import Button from '../components/Button';
import { fbSetUserBetaAccessState } from '../utils/fbBetaUserList';
import UserContext from '../contexts/userData';

const AddFilesTutorial1 = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);

  const setBetaAccessState = async () => {
    await fbSetUserBetaAccessState(user);
  }

  useEffect(() => {
    if (!user.hasBetaAccess) {
      setBetaAccessState();
    }
  }, [])

  const onContinuePress = () => {
    navigation.navigate('AddFilesTutorial2');
  }

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.contentContainer}>
          <Layout style={styles.videoContainer}>
            <Layout style={styles.videoBackground}>
              <Video
                source={videoFile}
                paused={false}
                style={{
                  height: 450,
                }}
                repeat={true}
              />
            </Layout>
          </Layout>
          <Layout style={styles.bottomContainer}>
            <Layout style={styles.instructions}>
              <Text category='h6'>
                Let's get started by adding meditations to your phone!
              </Text>
              <Text category='s1' style={styles.description}>
                We will guide you through 3 easy steps to add meditations...add more text here.
              </Text>
            </Layout>
            <Button size='large' onPress={onContinuePress}>
              Continue
            </Button>
          </Layout>
        </Layout>
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  bottomContainer: {
    flex: 3,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  description: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  instructions: {
    paddingVertical: 20,
  },
  videoBackground: {
    backgroundColor: 'black',
    borderRadius: 16,
    paddingVertical: 10,
    width: 225,
  },
  videoContainer: {
    flex: 7,
    alignItems: 'center',
  }
});

export default AddFilesTutorial1;

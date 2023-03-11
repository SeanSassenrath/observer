import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components/ui';
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';

//@ts-ignore
import videoFile from '../assets/app-tutorial-2-ios.mov';

import Button from '../components/Button';

const AddFilesTutorial2 = () => {
  const navigation = useNavigation();

  const onContinuePress = () => {
    navigation.navigate('AddFilesTutorial3');
  }

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
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
                  Step 1: Create a "Meditations" folder on your phone
                </Text>
                <Text category='s1' style={styles.description}>
                  Open the "Files" app on your phone, select "On My iPhone", then select "New Folder" from the overflow menu and name it "Meditations".
                </Text>
                <Text category='s1' style={styles.description}>
                  Great! Now you should have an empty "Meditations" folder to add meditations to!
                </Text>
              </Layout>
              <Button size='large' onPress={onContinuePress}>
                Continue
              </Button>
            </Layout>
          </Layout>
        </ScrollView>
        <LinearGradient colors={['rgba(34, 43, 69, 0)', 'rgba(34, 43, 69, 1)']} style={styles.linearGradientContainer} />
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  bottomContainer: {
    backgroundColor: 'transparent',
    flex: 3,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    // backgroundColor: 'red',
  },
  contentContainer: {
    backgroundColor: 'transparent',
    flex: 1,
    paddingBottom: 100,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  description: {
    backgroundColor: 'transparent',
    lineHeight: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  instructions: {
    backgroundColor: 'transparent',
    paddingVertical: 20,
  },
  linearGradientContainer: {
    bottom: 30,
    height: 50,
    position: 'absolute',
    width: '100%',
    // backgroundColor: 'blue',
  },
  videoBackground: {
    backgroundColor: 'black',
    borderRadius: 16,
    paddingVertical: 10,
    width: 225,
  },
  videoContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flex: 7,
  }
});

export default AddFilesTutorial2;

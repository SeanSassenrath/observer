import React, { useState} from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components/ui';
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';

//@ts-ignore
import dropboxVideo from '../assets/app-tutorial-3-ios-db.mov';
import googleVideo from '../assets/app-tutorial-3-ios-gd.mov';

import Button from '../components/Button';

enum Platform {
  Dropbox = 'Dropbox',
  GoogleDrive = 'Google Drive',
}

const platformCopy = {
  ios: {
    dropbox: {
      instructions: `Open Dropdox > Select the meditation you want to add > Select "Save to device" > Select "Save to Files" > Save the file in you "Meditations" folder`
    },
    google: {
      instructions: `Open Google Drive > Select the meditation you want to add > Select "Open in" > Select "Save to Files" > Save the file in you "Meditations" folder`
    }
  }
}

const AddFilesTutorial3 = () => {
  const navigation = useNavigation();
  const [platform, setPlatform] = useState(Platform.Dropbox);

  const onPlatformPress = (platform: Platform) => {
    setPlatform(platform);
  }

  const onContinuePress = () => {
    navigation.navigate('AddFilesTutorial4');
  }

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Layout style={styles.contentContainer}>
            <Layout style={styles.videoContainer}>
              <Layout style={styles.videoBackground}>
                <Video
                  source={platform === Platform.Dropbox ? dropboxVideo : googleVideo}
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
                <Layout style={styles.platformContainer}>
                  <Text 
                    category='s2'
                    style={styles.platformText}
                  >
                    Select platform
                  </Text>
                  <Layout style={styles.platformButtonContainer}>
                    <Button
                      appearance={platform === Platform.Dropbox ? 'filled' : 'outline'}
                      onPress={() => onPlatformPress(Platform.Dropbox)}
                      style={styles.platformButton}
                      status={platform === Platform.Dropbox ? 'info' : 'basic'}
                    >
                      Dropbox
                    </Button>
                    <Button
                      appearance={platform === Platform.GoogleDrive ? 'filled' : 'outline'}
                      onPress={() => onPlatformPress(Platform.GoogleDrive)}
                      status={platform === Platform.GoogleDrive ? 'info' : 'basic'}
                      style={styles.platformButton}
                    >
                      Google Drive
                    </Button>
                  </Layout>
                </Layout>
                <Text category='h6'>
                  Step 2: Export meditations from {platform} to your "Meditations" folder
                </Text>
                <Text category='s1' style={styles.description}>
                  { platform === Platform.Dropbox
                    ? platformCopy.ios.dropbox.instructions
                    : platformCopy.ios.google.instructions
                  }
                </Text>
                <Text category='s1' style={styles.description}>
                  Excellent! Just one more step to go!
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
    bottom: 0,
    height: 150,
    position: 'absolute',
    width: '100%',
  },
  platformButton: {
    marginHorizontal: 10,
    width: 140,
  },
  platformButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  platformContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 30,
  },
  platformText: {
    paddingBottom: 20,
    textAlign: 'center',
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

export default AddFilesTutorial3;

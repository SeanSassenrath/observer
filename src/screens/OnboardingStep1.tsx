import { Linking, Platform, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Layout, Text } from "@ui-kitten/components/ui";
import { useNavigation } from "@react-navigation/native";

import Button from "../components/Button";

const dropboxYoutubeLink = 'https://www.youtube.com/watch?v=XJ0Bh9RmObA';
const googleDriveYoutubeLink = 'https://www.youtube.com/watch?v=GaO-aArPZJ8';

const OnboardingStep1 = () => {
  const navigation = useNavigation();

  const onContinuePress = () => navigation.navigate('OnboardingStep2');

  const onDropboxVideoPress = async () => {
    await Linking.openURL(dropboxYoutubeLink);
  }

  const onGoogleDriveVideoPress = async () => {
    await Linking.openURL(googleDriveYoutubeLink);
  }

  const renderDisclaimer = Platform.OS === 'ios'
    ? `For this app to work correctly, please ensure that meditations are stored directly on your phone.`
    : `For this app to work correctly, please ensure that meditations are stored directly on your phone.`

  return (
    <Layout level="4" style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout level="4" style={styles.contentContainer}>
          <Layout level="4" style={styles.heroContainer}>
            <Text
              category="h2"
              style={styles.header}
            >
              Let's get started
            </Text>
            <Text
              category="h6"
              style={styles.disclaimer}
            >
              {renderDisclaimer}
            </Text>
            <Layout
              level='2'
              style={styles.faqBackground}
            >
              <Pressable
                onPress={onDropboxVideoPress}
              >
                <Text style={styles.faqItem}>
                  Learn how to download meditations from Dropbox.
                </Text>
              </Pressable>
              <Pressable
                onPress={onGoogleDriveVideoPress}
              >
                <Text style={styles.faqItem}>
                  Learn how to download meditations from Google Drive.
                </Text>
              </Pressable>
            </Layout>
          </Layout>
          <Layout level="4" style={styles.bottomContainer}>
            <Button
              onPress={onContinuePress}
              size='large'
              style={styles.button}
            >
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
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    marginBottom: 16,
    width: 300
  },
  buttonTest: {
    marginTop: 16,
    width: 300
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  disclaimer: {
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '600'
  },
  faqBackground: {
    borderRadius: 16,
    padding: 20,
    marginTop: 80,
  },
  faqItem: {
    lineHeight: 26,
    marginVertical: 12,
    opacity: 0.9,
    textDecorationLine: 'underline',
  },
  header: {
    marginBottom: 60,
  },
  headerContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  helpIcon: {
    height: 32,
    opacity: 0.9,
    width: 32,
  },
  heroContainer: {
    alignItems: 'center',
    flex: 9,
    justifyContent: 'center',
  },
  supportedMeditationsContainer: {
    borderRadius: 16,
    height: 300,
    marginBottom: 30,
    paddingVertical: 16,
    paddingLeft: 16,
    paddingRight: 6,
  },
  supportedMeditationItem: {
    lineHeight: 22,
    marginVertical: 8,
  }
})

export default OnboardingStep1;
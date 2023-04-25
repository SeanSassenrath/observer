import { useContext, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Layout, Text } from "@ui-kitten/components/ui";
import { useNavigation } from "@react-navigation/native";

import Button from "../components/Button";
import { onAddMeditations } from "../utils/addMeditations";
import MeditationBaseDataContext from "../contexts/meditationBaseData";
import { fbUpdateUser } from "../fb/user";
import UserContext from "../contexts/userData";
import SupportedMeditationsList from "../components/SupportedMeditationsList";
import { meditationBaseMap } from "../constants/meditation";
import MeditationFilePathsContext from "../contexts/meditationFilePaths";

const OnboardingStep2 = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const { meditationFilePaths, setMeditationFilePaths } = useContext(MeditationFilePathsContext)
  const { meditationBaseData, setMeditationBaseData } = useContext(MeditationBaseDataContext);

  const onAddMeditationsPress = async () => {
    const meditations = await onAddMeditations(
      meditationFilePaths,
      setMeditationFilePaths,
      true,
    )
    if (meditations) {
      setMeditationBaseData(meditations);
      await fbUpdateUser(user.uid, { 'onboarding.hasSeenAddMeditationOnboarding': true });
      //@ts-ignore
      navigation.navigate('TabNavigation', { screen: 'Library' });
    }
  }

  const numOfMeditations = Object.keys(meditationBaseMap).length;

  return (
    <Layout level="4" style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout level="4" style={styles.contentContainer}>
          <Layout level="4" style={styles.heroContainer}>
            <Text
              category="h2"
              style={styles.header}
            >
              Add your meditations
            </Text>
            <Text
              category="s1"
              style={styles.disclaimer}
            >
              Listed below are the {numOfMeditations} meditations that we currently support.
            </Text>
            <SupportedMeditationsList />
          </Layout>
          <Layout level="4" style={styles.bottomContainer}>
            <Button
              onPress={onAddMeditationsPress}
              size='large'
              style={styles.button}
            >
              Add Meditations
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
    marginBottom: 24,
    fontWeight: '600',
  },
  faqBackground: {
    borderRadius: 16,
    padding: 20,
    marginTop: 80,
  },
  faqHeader: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  faqItem: {
    lineHeight: 26,
    marginVertical: 12,
    opacity: 0.9,
    textDecorationLine: 'underline',
  },
  header: {
    marginBottom: 60,
    textAlign: 'center',
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

export default OnboardingStep2;

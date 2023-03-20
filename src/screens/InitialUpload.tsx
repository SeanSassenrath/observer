import { useContext, useState } from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon, Layout, Modal, Text } from "@ui-kitten/components/ui";
import { useNavigation } from "@react-navigation/native";

import Button from "../components/Button";
import { meditationBaseMap } from "../constants/meditation";
import { onAddMeditations } from "../utils/addMeditations";
import { MeditationFilePathData } from "../utils/asyncStorageMeditation";
import MeditationBaseDataContext from "../contexts/meditationBaseData";
import { fbUpdateUser } from "../fb/user";
import UserContext from "../contexts/userData";

interface HelpIconProps {
  fill: string,
  style?: any,
}

const HelpIcon = (props: HelpIconProps) => (
  <Icon {...props} name='question-mark-circle'/>
)

enum ModalContext {
  Phone,
  Download,
  Supported,
}

const InitialUploadScreen = () => {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContext, setModalContext] = useState(ModalContext.Phone);
  const [existingMediationFilePathData, setExistingMeditationFilePathData] = useState({} as MeditationFilePathData);
  const { meditationBaseData, setMeditationBaseData } = useContext(MeditationBaseDataContext);


  const onSkipPress = () => {
    //@ts-ignore
    navigation.navigate('TabNavigation', { screen: 'Home' });
  }

  const onAddMeditationsPress = async () => {
    const meditations = await onAddMeditations(
      existingMediationFilePathData,
      setExistingMeditationFilePathData,
    )
    if (meditations) {
      setMeditationBaseData(meditations);
      await fbUpdateUser(user.uid, { 'onboarding.hasSeenAddMeditationOnboarding': true });
      //@ts-ignore
      navigation.navigate('TabNavigation', { screen: 'Library' });
    }
  }

  const onFaqItemPress = (modalContext: ModalContext) => {
    setModalContext(modalContext);
    setIsModalVisible(true);
  }

  const makeSupportedMeditationData = () => {
    const nameList = [];

    for (const key in meditationBaseMap) {
      const meditationName = meditationBaseMap[key].name;
      nameList.push(meditationName);
    }

    return nameList.sort();
  }

  const renderSupportedMeditationItem = ({ item }: any) => (
    <Text category="s1" style={styles.supportedMeditationItem}>{item}</Text>
  )

  const renderModalContext = () => {
    if (modalContext === ModalContext.Phone) {
      return (
        <>
          <Text category="s1" style={styles.modalContextHeader}>
            Meditations need to be stored on your phone for the following reasons:
          </Text>
          <Text category="s1" style={styles.modalContextText}>
            1. Due to copyright it is required for you to own all meditations
            used with this app.
            We are simply a tool to help support your practice.
          </Text>
          <Text category="s1" style={styles.modalContextText}>
            2. Meditations stored outside of your phone will break the player.
          </Text>
        </>
      )
    } else if (modalContext === ModalContext.Download) {
      return (
        <>
        </>
      )
    } else if (modalContext === ModalContext.Supported) {
      return (
        <>
          <Text category="s1" style={styles.modalContextHeader}>
            At this moment we support the following meditations and breath work:
          </Text>
          <Layout style={styles.supportedMeditationsContainer}>
            <FlatList
              data={makeSupportedMeditationData()}
              renderItem={renderSupportedMeditationItem}
            />
          </Layout>
          <Text category="s1" style={styles.modalContextText}>
            * If you are having trouble uploading meditations that are on this list,
            please reach out to customer service and we will assist you as soon as possible.
          </Text>
        </>
      )
    }
  }

  return (
    <Layout level="4" style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout level="4" style={styles.contentContainer}>
          <Layout level="4" style={styles.headerContainer}>
            <HelpIcon
              fill="#FFFFFF"
              style={styles.helpIcon}
            />
          </Layout>
          <Layout level="4" style={styles.heroContainer}>
            <Text
              category="h3"
              style={styles.header}
            >
              Let's get started!
            </Text>
            {/* <Button onPress={() => { }} size='large' style={styles.buttonTest}>Add Meditations</Button> */}
            <Text category="s1">Add meditations from your phone</Text>
          </Layout>
          <Layout
            level='4'
            style={styles.faqContainer}
          >
            <Layout
              level='2'
              style={styles.faqBackground}
            >
              <Text style={styles.faqHeader}>
                FAQs
              </Text>
              <Pressable
                onPress={() => onFaqItemPress(ModalContext.Phone)}
              >
                <Text style={styles.faqItem}>
                  Why do meditations need to be on my phone?
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onFaqItemPress(ModalContext.Download)}
              >
                <Text style={styles.faqItem}>
                  How do I download meditations onto my phone from Dropbox or Google Drive?
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onFaqItemPress(ModalContext.Supported)}
              >
                <Text style={styles.faqItem}>
                  What meditations are supported in this app?
                </Text>
              </Pressable>
            </Layout>
          </Layout>
          <Layout level="4" style={styles.bottomContainer}>
            <Button
              onPress={onAddMeditationsPress}
              size='large'
              style={styles.button}
            >
              Add Meditations
            </Button>
            <Button
              onPress={onSkipPress}
              size='large'
              status="control"
              appearance="ghost" 
              style={styles.button}
            >
              Skip
            </Button>
          </Layout>
        </Layout>
      </SafeAreaView>
      <Modal
        visible={isModalVisible}
        backdropStyle={styles.modalBackdrop}
        onBackdropPress={() => setIsModalVisible(false)}
      >
        <Layout level='3' style={styles.modalContainer}>
          <Layout level='3'>
            {renderModalContext()}
          </Layout>
          <Button
            onPress={() => setIsModalVisible(false)}
            style={styles.modalButton}
          >
            Close
          </Button>
        </Layout>
      </Modal>
    </Layout>
  )
}

const styles = StyleSheet.create({
  bottomContainer: {
    flex: 4,
    justifyContent: 'center',
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
    paddingHorizontal: 20,
  },
  faqBackground: {
    borderRadius: 16,
    flex: 1,
    padding: 20,
  },
  faqContainer: {
    flex: 4,
  },
  faqHeader: {
    fontWeight: 'bold',
  },
  faqItem: {
    lineHeight: 26,
    marginVertical: 12,
    opacity: 0.9,
    textDecorationLine: 'underline',
  },
  header: {
    marginBottom: 10,
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
    flex: 3,
    justifyContent: 'center',
  },
  modalBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalButton: {
    marginTop: 20,
  },
  modalContainer: {
    borderRadius: 16,
    padding: 20,
    width: 350,
  },
  modalContextHeader: {
    lineHeight: 22,
    marginBottom: 24,
    opacity: 0.9,
  },
  modalContextText: {
    lineHeight: 22,
    marginBottom: 20,
    opacity: 0.9,
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

export default InitialUploadScreen;
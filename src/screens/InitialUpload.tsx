import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon, Layout, Text } from "@ui-kitten/components/ui";
import Button from "../components/Button";

interface HelpIconProps {
  fill: string,
  style?: any,
}

const HelpIcon = (props: HelpIconProps) => (
  <Icon {...props} name='question-mark-circle'/>
)

const InitialUploadScreen = () => {

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
              <Text style={styles.faqItem}>
                Why do meditations need to be on my phone?
              </Text>
              <Text style={styles.faqItem}>
                How do I download meditations onto my phone from Dropbox or Google Drive?
              </Text>
              <Text style={styles.faqItem}>
                What meditations are supported in this app?
              </Text>
            </Layout>
          </Layout>
          <Layout level="4" style={styles.bottomContainer}>
            <Button onPress={() => {}} size='large' style={styles.button}>Add Meditations</Button>
            <Button
              onPress={() => {}}
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
})

export default InitialUploadScreen;
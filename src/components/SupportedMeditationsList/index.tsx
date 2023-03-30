import { FlatList, StyleSheet } from "react-native";
import { Layout, Text } from "@ui-kitten/components/ui";

import { meditationBaseMap } from "../../constants/meditation";
import LinearGradient from "react-native-linear-gradient";

const SupportedMeditationsList = () => {
  const makeSupportedMeditationData = () => {
    const nameList = [];

    for (const key in meditationBaseMap) {
      const meditationName = meditationBaseMap[key].name;
      nameList.push(meditationName);
    }

    return nameList.sort();
  }

  const renderSupportedMeditationItem = ({ item }: any) => (
    <Layout level="3" style={styles.supportedMeditationItemContainer}>
      <Layout level="3" style={styles.separator}/>
      <Text category="s1" style={styles.supportedMeditationItem}>{item}</Text>
    </Layout>
  )

  return (
    <Layout style={styles.supportedMeditationsContainer}>
      <FlatList
        data={makeSupportedMeditationData()}
        renderItem={renderSupportedMeditationItem}
      />
    </Layout>
  )
}

const styles = StyleSheet.create({
  supportedMeditationsContainer: {
    borderRadius: 16,
    height: 400,
    marginBottom: 30,
    width: 350,
    paddingHorizontal: 16,
  },
  supportedMeditationItem: {
    lineHeight: 22,
    paddingVertical: 24,
  },
  supportedMeditationItemContainer: {
    backgroundColor: 'transparent',
  },
  separator: {
    borderWidth: 0.5,
    borderColor: 'gray',
    opacity: 0.4
  }
})

export default SupportedMeditationsList;

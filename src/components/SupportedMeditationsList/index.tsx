import { FlatList, StyleSheet } from "react-native";
import { Layout, Text } from "@ui-kitten/components/ui";
import { uniq } from "lodash";

import { meditationBaseMap } from "../../constants/meditation";

const SupportedMeditationsList = () => {
  const makeSupportedMeditationData = () => {
    const nameList = [];

    for (const key in meditationBaseMap) {
      const meditationName = meditationBaseMap[key].name;

      nameList.push(meditationName);
    }

    return uniq(nameList).sort();
  }

  const renderSupportedMeditationItem = ({ item, index }: any) => (
    <Layout level="3" style={styles.supportedMeditationItemContainer}>
      {index === 0 ? null : <Layout level="3" style={styles.separator}/> }
      <Text category="s1" style={styles.supportedMeditationItem}>{item}</Text>
    </Layout>
  )

  return (
    <Layout level='2' style={styles.supportedMeditationsContainer}>
      <FlatList
        data={makeSupportedMeditationData()}
        renderItem={renderSupportedMeditationItem}
      />
    </Layout>
  )
}

const styles = StyleSheet.create({
  supportedMeditationsContainer: {
    borderRadius: 4,
    flex: 1,
    marginBottom: 30,
    width: 350,
    paddingHorizontal: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(225, 225, 225, 0.1)'
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

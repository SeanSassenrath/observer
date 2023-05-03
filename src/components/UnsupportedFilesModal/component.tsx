import { FlatList, StyleSheet } from "react-native";
import { Icon, Layout, Modal, Text } from "@ui-kitten/components";

import { UnsupportedFileData } from "../../types";
import _Button from "../Button";

const errorRed = '#E28E69';

const ErrorIcon = (props: any) => (
  <Icon {...props} style={iconStyles.errorIcon} fill={errorRed} name='alert-circle-outline' />
);

interface Props {
  isVisible: boolean;
  unsupportedFiles: UnsupportedFileData[];
  setUnsupportedFiles(a: UnsupportedFileData[]): void;
}

const renderUnsupportedFile = (file: UnsupportedFileData) => (
  <Layout level='1' style={styles.item}>
    <Text category="s1">{file.name || ""}</Text>
  </Layout>
)

export const UnsupportedFilesModalComponent = (props: Props) => {
  const {
    isVisible,
    unsupportedFiles,
    setUnsupportedFiles,
  } = props;

  const onContinuePress = () => {
    setUnsupportedFiles([]);
  }

  return (
    <Modal
      visible={isVisible}
      backdropStyle={styles.backdrop}
    >
      <Layout level='3' style={styles.container}>
        <Layout level='3' style={styles.headerContainer}>
          <ErrorIcon />
          <Text category='h6' style={styles.header}>
            There was an error adding the following meditations:
          </Text>
        </Layout>
        <Layout level='2' style={styles.flatListContainer}>
          <FlatList
            data={unsupportedFiles}
            renderItem={({ item }) => renderUnsupportedFile(item)}
          />
        </Layout>
        <Layout level='3' style={styles.buttonContainer}>
          <Text category="s1" style={styles.bottomText}>
            The team is looking into this error. Please email <Text category="s1" status="info">sean.sassenrath@gmail.com</Text> with any questions.
          </Text>
          <_Button
            onPress={onContinuePress}
            style={styles.button}
          >
            Close
          </_Button>
        </Layout>
      </Layout>
    </Modal>
  )
}

const iconStyles = StyleSheet.create({
  errorIcon: {
    height: 30,
    width: 30,
  },
});

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  bottomText: {
    lineHeight: 18,
    textAlign: 'center',
    opacity: 0.95,
  },
  buttonContainer: {
    flex: 3,
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 14,
  },
  container: {
    flex: 1,
    height: 500,
    width: 350,
    borderRadius: 6,
    padding: 20,
  },
  flatListContainer: {
    marginBottom: 20,
    flex: 5,
    borderRadius: 6,
  },
  headerContainer: {
    alignItems: 'center',
    flex: 3,
  },
  header: {
    lineHeight: 26,
    textAlign: 'center',
    opacity: 0.95,
    marginTop: 20,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  }
})

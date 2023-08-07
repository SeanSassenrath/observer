import React, {useContext, useState} from 'react';
import {Icon, Layout, Modal, Text, useStyleSheet} from '@ui-kitten/components';
import {Pressable, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {SearchBar} from '../components/SearchBar';
import {sortBy} from 'lodash';

import Button from '../components/Button';
import UnsupportedFilesContext from '../contexts/unsupportedFiles';
import {meditationBaseMap} from '../constants/meditation-data';
import {MeditationBase} from '../types';
import MeditationFilePathsContext from '../contexts/meditationFilePaths';
import {setMeditationFilePathDataInAsyncStorage} from '../utils/asyncStorageMeditation';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import MeditationBaseDataContext from '../contexts/meditationBaseData';
import {makeMeditationBaseData} from '../utils/meditation';

const EMPTY_SEARCH = '';
const EMPTY_SELECTED_OPTION = '';
const errorRed = '#C55F41';

const ErrorIcon = (props: any) => (
  <Icon
    {...props}
    style={iconStyles.errorIcon}
    fill={errorRed}
    name="alert-circle-outline"
  />
);

const iconStyles = StyleSheet.create({
  errorIcon: {
    height: 30,
    width: 30,
  },
});

interface MeditationOptionProps {
  name: string;
  selected: boolean;
  onPress(): void;
}

const MeditationOption = (props: MeditationOptionProps) => {
  const {name, onPress, selected} = props;
  return (
    <Pressable onPress={onPress}>
      <Layout
        level="4"
        style={
          selected
            ? MeditationOptionStyles.meditationSelected
            : MeditationOptionStyles.meditationDefault
        }>
        <Text category="h6" style={MeditationOptionStyles.text}>
          {name}
        </Text>
        {/* <Layout level="4" style={MeditationOptionStyles.statusContainer}>
          <Layout
            level="4"
            style={
              selected
                ? MeditationOptionStyles.statusSelected
                : MeditationOptionStyles.statusDefault
            }
          />
        </Layout> */}
      </Layout>
    </Pressable>
  );
};

const MeditationOptionStyles = StyleSheet.create({
  meditationDefault: {
    borderBottomColor: '#f3f3f3',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    opacity: 0.5,
  },
  meditationSelected: {
    borderBottomColor: '#f3f3f3',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    opacity: 1,
  },
  statusDefault: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 50,
    height: 25,
    width: 25,
  },
  statusSelected: {
    backgroundColor: 'green',
    borderWidth: 2,
    borderColor: 'green',
    borderRadius: 50,
    height: 25,
    width: 25,
  },
  statusContainer: {
    flex: 1,
    marginLeft: 20,
  },
  text: {
    flex: 9,
    fontSize: 16,
  },
});

const FixMeditationScreen = () => {
  const {unsupportedFiles, setUnsupportedFiles} = useContext(
    UnsupportedFilesContext,
  );
  const [unsupportedFileIndex, setUnsupportedFileIndex] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {meditationFilePaths, setMeditationFilePaths} = useContext(
    MeditationFilePathsContext,
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {meditationBaseData, setMeditationBaseData} = useContext(
    MeditationBaseDataContext,
  );
  const [searchInput, setSearchInput] = useState(EMPTY_SEARCH);
  const [selectedMeditationOption, setSelectedMeditationOption] = useState(
    EMPTY_SELECTED_OPTION,
  );
  const [isModalVisible, setIsModalVisible] = useState(true);

  const styles = useStyleSheet(themedStyles);
  const navigation = useNavigation();
  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 2];

  const onSearchClearPress = () => setSearchInput(EMPTY_SEARCH);
  const onMeditationOptionPress = (meditationBase: MeditationBase) => {
    if (selectedMeditationOption === meditationBase.meditationBaseId) {
      setSelectedMeditationOption(EMPTY_SELECTED_OPTION);
    } else {
      setSelectedMeditationOption(meditationBase.meditationBaseId);
    }
  };

  const getMeditationOptions = () => {
    const meditationOptions = [];
    for (const key in meditationBaseMap) {
      const meditation = meditationBaseMap[key];
      if (meditation.name.includes(searchInput)) {
        meditationOptions.push(meditation);
      }
    }

    return sortBy(meditationOptions, 'name');
  };

  const onNextPress = async () => {
    const isLastMeditation =
      unsupportedFiles.length <= unsupportedFileIndex + 1;

    try {
      const updatedMeditationFilePaths = Object.assign(meditationFilePaths, {
        [selectedMeditationOption]: unsupportedFiles[unsupportedFileIndex]?.uri,
      });

      await setMeditationFilePathDataInAsyncStorage(updatedMeditationFilePaths);
      console.log(
        'Setting updated file paths to context',
        updatedMeditationFilePaths,
      );
      setMeditationFilePaths(updatedMeditationFilePaths);

      const _meditationBaseData = await makeMeditationBaseData();
      if (_meditationBaseData) {
        setMeditationBaseData(_meditationBaseData);
      }

      setUnsupportedFiles([]);

      if (isLastMeditation && !(prevRoute.name === 'AddMeditations')) {
        Toast.show({
          type: 'success',
          text1: 'Meditations added',
          text2: 'New meditations were added to your library',
          position: 'bottom',
          bottomOffset: 100,
          visibilityTime: 5000,
        });
        //@ts-ignore
        navigation.navigate('TabNavigation', {screen: 'Library'});
      } else if (isLastMeditation) {
        //@ts-ignore
        navigation.navigate('TabNavigation', {screen: 'Library'});
      } else {
        setUnsupportedFileIndex(unsupportedFileIndex + 1);
      }
    } catch (e) {
      console.log('Add meditation file path error', e);
    }
  };

  const onSkipPress = () => {
    // create meditation base for custom meditation
    // create custom group
    // add meditation to async storage
    // add meditation to context

    const isLastMeditation =
      unsupportedFiles.length <= unsupportedFileIndex + 1;

    if (isLastMeditation) {
      //@ts-ignore
      navigation.navigate('TabNavigation', {screen: 'Library'});
    } else {
      setUnsupportedFileIndex(unsupportedFileIndex + 1);
    }
  };

  const meditationOptions = getMeditationOptions();
  const currentUnsupportedFileName =
    unsupportedFiles[unsupportedFileIndex]?.name;

  return (
    <Layout level="4" style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout level="4" style={styles.top}>
          <Layout level="4" style={styles.topContentContainer}>
            <ErrorIcon />
            <Text category="h6" style={styles.topText}>
              File not recognized ({unsupportedFileIndex + 1}&nbsp;of&nbsp;
              {unsupportedFiles.length})
            </Text>
          </Layout>
        </Layout>
        <Layout level="4" style={styles.middle}>
          <Text category="h5">Which meditation is this?</Text>
          <Layout level="4" style={styles.unsupportedFileContainer}>
            <Text category="s1" style={styles.unsupportedFileName}>
              File: {currentUnsupportedFileName || ''}
            </Text>
          </Layout>
          {/* <Text category="h5">Which meditation is this?</Text> */}
          <SearchBar
            placeholder="Enter meditation name"
            input={searchInput}
            onChangeText={setSearchInput}
            onClearPress={onSearchClearPress}
            style={styles.searchBar}
          />
          <ScrollView>
            {searchInput ? (
              meditationOptions.length ? (
                meditationOptions.map(option => (
                  <MeditationOption
                    key={option.meditationBaseId}
                    name={option.name}
                    onPress={() => onMeditationOptionPress(option)}
                    selected={
                      selectedMeditationOption === option.meditationBaseId
                    }
                  />
                ))
              ) : (
                <Layout level="4" style={styles.noResultsContainer}>
                  <Text category="s1" style={styles.noResults}>
                    It looks like we don't support this meditation yet.
                  </Text>
                  <Text category="s1" style={styles.noResults}>
                    Double check the spelling or press skip to continue.
                  </Text>
                </Layout>
              )
            ) : null}
          </ScrollView>
        </Layout>
        <Layout level="4" style={styles.bottom}>
          <Button
            disabled={!selectedMeditationOption.length || !searchInput.length}
            onPress={onNextPress}
            size="large"
            style={styles.nextButton}>
            Next
          </Button>
          <Button
            appearance="ghost"
            onPress={onSkipPress}
            size="large"
            status="basic">
            Skip
          </Button>
        </Layout>
      </SafeAreaView>
      <Modal
        visible={isModalVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setIsModalVisible(false)}>
        <Layout level="3" style={styles.modalContainer}>
          <Layout level="3" style={styles.modalTop}>
            <Text category="h6" style={styles.modalHeader}>
              Add a name for this meditation
            </Text>
            <Text category="s1" style={styles.modalFile}>
              File: {currentUnsupportedFileName || ''}
            </Text>
          </Layout>
          <Layout level="3" style={styles.modalBottom}>
            <Button onPress={() => {}} size="large" style={styles.modalButton}>
              Add
            </Button>
            <Button
              appearance="ghost"
              onPress={() => setIsModalVisible(false)}
              style={styles.modalButton}
              size="large"
              status="basic">
              Close
            </Button>
          </Layout>
        </Layout>
      </Modal>
    </Layout>
  );
};

const themedStyles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  bottom: {
    flex: 2,
    paddingBottom: 20,
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
  },
  countBackground: {
    borderRadius: 50,
    flexDirection: 'row',
    height: 10,
  },
  countForeground: {
    borderRadius: 50,
    backgroundColor: 'color-primary-500',
    height: 10,
    width: '20%',
  },
  countText: {
    paddingBottom: 10,
  },
  description: {
    marginTop: 10,
    opacity: 0.75,
  },
  middle: {
    flex: 7,
    paddingHorizontal: 20,
  },
  modalBottom: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  modalButton: {
    marginTop: 20,
    width: 300,
  },
  modalContainer: {
    justifyContent: 'space-between',
    height: 400,
    width: 350,
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  modalTop: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  modalHeader: {
    width: '100%',
  },
  modalFile: {
    marginVertical: 20,
    opacity: 0.75,
    width: '100%',
  },
  nextButton: {
    color: 'white',
    marginBottom: 16,
  },
  noResults: {
    marginTop: 10,
    textAlign: 'center',
  },
  noResultsContainer: {
    marginTop: 20,
    opacity: 0.75,
  },
  searchBar: {
    marginVertical: 16,
  },
  top: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    textAlign: 'center',
  },
  topContentContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  topText: {
    color: 'color-danger-400',
    marginLeft: 10,
  },
  unsupportedFileContainer: {
    borderRadius: 8,
    marginBottom: 20,
    paddingVertical: 16,
  },
  unsupportedFileName: {
    lineHeight: 24,
    opacity: 0.75,
  },
});

export default FixMeditationScreen;

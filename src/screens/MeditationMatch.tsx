import React, {useContext, useState} from 'react';
import {Pressable, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {Layout, Modal, Text, useStyleSheet} from '@ui-kitten/components';
import LinearGradient from 'react-native-linear-gradient';

import {
  MeditationBase,
  MeditationBaseMap,
  MeditationId,
  MeditationMatchScreenNavigationProp,
  MeditationMatchScreenRouteProp,
} from '../types';
import {SearchBar} from '../components/SearchBar';
import {_MeditationListSection} from '../components/MeditationList';
import {sortBy} from 'lodash';
import {
  MeditationGroupName,
  botecMap,
  breakingHabitMap,
  breathMap,
  dailyMeditationsMap,
  foundationalMap,
  generatingMap,
  meditationBaseMap,
  otherMap,
  synchronizeMap,
  unlockedMap,
  walkingMap,
} from '../constants/meditation-data';
import Button from '../components/Button';
import MeditationFilePathsContext from '../contexts/meditationFilePaths';
import {setMeditationFilePathDataInAsyncStorage} from '../utils/asyncStorageMeditation';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {makeMeditationBaseData} from '../utils/meditation';
import MeditationBaseDataContext from '../contexts/meditationBaseData';

const EMPTY_SEARCH = '';
const EMPTY_ID = '';

interface Props {
  navigation: MeditationMatchScreenNavigationProp;
  route: MeditationMatchScreenRouteProp;
}

const MeditationMatchScreen = (props: Props) => {
  const {route} = props;
  const params = route && route.params;
  const medsFail = params && params.medsFail;

  const {meditationFilePaths, setMeditationFilePaths} = useContext(
    MeditationFilePathsContext,
  );
  const {meditationBaseData, setMeditationBaseData} = useContext(
    MeditationBaseDataContext,
  );

  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [searchInput, setSearchInput] = useState(EMPTY_SEARCH);
  const [selectedMedId, setSelectedMedId] = useState(EMPTY_ID);
  const [existingMedLink, setExistingMedLink] = useState(EMPTY_ID);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const styles = useStyleSheet(themedStyles);

  const navigation = useNavigation();

  const onClearSearchPress = () => setSearchInput(EMPTY_SEARCH);

  const fileCount = medsFail && medsFail.length;
  const file = medsFail[currentFileIndex];
  const fileName = file.name || '';

  const existingMedLinkCheck = () => {
    const existingMedIds = Object.keys(meditationFilePaths);

    if (existingMedIds.length > 0) {
      console.log('HERE - existingMedIds', existingMedIds);
      console.log('HERE - selectedMedId', selectedMedId);
      const _existingMedLink = existingMedIds.find(id => id === selectedMedId);
      console.log('HERE - _existingMedLink', _existingMedLink);

      if (_existingMedLink) {
        setExistingMedLink(_existingMedLink);
        return _existingMedLink;
      }
    }
    return false;
  };

  const resetState = () => {
    setSearchInput(EMPTY_SEARCH);
    setSelectedMedId(EMPTY_ID);
    setExistingMedLink(EMPTY_ID);
    setCurrentFileIndex(currentFileIndex + 1);
  };

  const saveFileToMedId = async () => {
    const currentFile = medsFail[currentFileIndex];
    const lastFile = medsFail[medsFail.length - 1];

    if (currentFile && currentFile.uri) {
      const matchedMeditation = {[selectedMedId]: currentFile.uri};
      const updatedMeditations = {...meditationFilePaths, ...matchedMeditation};
      await setMeditationFilePathDataInAsyncStorage(updatedMeditations);
      setMeditationFilePaths(updatedMeditations);

      if (lastFile && lastFile.uri === currentFile.uri) {
        const _meditationBaseData = await makeMeditationBaseData();
        if (
          _meditationBaseData &&
          Object.keys(_meditationBaseData).length > 0
        ) {
          setMeditationBaseData(_meditationBaseData);
        }
        navigation.navigate('AddMedsSuccess');
      } else {
        Toast.show({
          type: 'success',
          text1: 'Meditation Added',
          position: 'bottom',
          bottomOffset: 100,
          visibilityTime: 1500,
        });

        resetState();
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Meditation Not Added',
        text2: "Let's try the next one",
        position: 'bottom',
        bottomOffset: 100,
        visibilityTime: 2000,
      });
      resetState();
    }
  };

  const onContinuePress = async () => {
    const _existingMedLink = existingMedLinkCheck();

    if (_existingMedLink) {
      setIsModalVisible(true);
      return;
    }

    await saveFileToMedId();
  };

  const onModalConfirmPress = async () => {
    setIsModalVisible(false);
    await saveFileToMedId();
  };

  const onSkipPress = () => {
    const currentFile = medsFail[currentFileIndex];
    const lastFile = medsFail[medsFail.length - 1];

    if (lastFile && lastFile.uri === currentFile.uri) {
      navigation.navigate('AddMedsSuccess');
    } else {
      setSearchInput(EMPTY_SEARCH);
      setSelectedMedId(EMPTY_ID);
      setCurrentFileIndex(currentFileIndex + 1);
    }
  };

  const onMeditationPress = (meditationId: MeditationId) => {
    if (meditationId === selectedMedId) {
      setSelectedMedId(EMPTY_ID);
    } else {
      setSelectedMedId(meditationId);
    }
  };

  const renderMeditationGroupSection = (
    header: string,
    meditationGroupMap: MeditationBaseMap,
  ) => {
    const meditationList = [] as MeditationBase[];
    const meditationGroupKeys = Object.keys(meditationGroupMap);
    meditationGroupKeys.forEach(key => {
      if (meditationBaseMap[key]) {
        if (searchInput.length > 0) {
          if (meditationBaseMap[key].name.includes(searchInput)) {
            return meditationList.push(meditationBaseMap[key]);
          }
        } else {
          meditationList.push(meditationBaseMap[key]);
        }
      }
    });

    if (meditationList.length <= 0) {
      return null;
    }

    const sortedMeditationList = sortBy(meditationList, 'name');

    return (
      <_MeditationListSection
        key={header}
        header={header}
        meditationList={sortedMeditationList}
        onMeditationPress={onMeditationPress}
        selectedCardId={selectedMedId}
      />
    );
  };

  return (
    <Layout level="4" style={styles.screenContainer}>
      <SafeAreaView style={styles.safeArea}>
        <Layout level="4" style={styles.topContainer}>
          <Layout level="4" style={styles.topBarContainer}>
            <Text category="s2" style={styles.fileCount}>
              File {currentFileIndex + 1} of {fileCount}
            </Text>
            <Pressable onPress={onSkipPress}>
              <Text category="s2" style={styles.topSkipText}>
                Skip
              </Text>
            </Pressable>
          </Layout>
          <Text category="s1" style={styles.instructionText}>
            Select the meditation that matches this file:
            <Text category="s1" style={styles.fileName}>
              {` ${fileName}`}
            </Text>
          </Text>
        </Layout>
        <Layout style={styles.mainContainer}>
          <ScrollView style={styles.scrollContainer}>
            <Layout level="4" style={styles.searchContainer}>
              <SearchBar
                input={searchInput}
                onChangeText={setSearchInput}
                onClearPress={onClearSearchPress}
              />
            </Layout>
            <Layout level="4">
              {renderMeditationGroupSection(
                MeditationGroupName.BlessingEnergyCenter,
                botecMap,
              )}
              {renderMeditationGroupSection(
                MeditationGroupName.BreakingHabit,
                breakingHabitMap,
              )}
              {renderMeditationGroupSection(
                MeditationGroupName.BreathTracks,
                breathMap,
              )}
              {renderMeditationGroupSection(
                MeditationGroupName.Daily,
                dailyMeditationsMap,
              )}
              {renderMeditationGroupSection(
                MeditationGroupName.Foundational,
                foundationalMap,
              )}
              {renderMeditationGroupSection(
                MeditationGroupName.Generating,
                generatingMap,
              )}
              {renderMeditationGroupSection(
                MeditationGroupName.Other,
                otherMap,
              )}
              {renderMeditationGroupSection(
                MeditationGroupName.Synchronize,
                synchronizeMap,
              )}
              {renderMeditationGroupSection(
                MeditationGroupName.Walking,
                walkingMap,
              )}
              {renderMeditationGroupSection(
                MeditationGroupName.Unlocked,
                unlockedMap,
              )}
              {selectedMedId.length <= 0 ? (
                <Layout style={styles.skipContainer}>
                  <Text category="s1" style={styles.skipHeader}>
                    Unable to find the meditation?
                  </Text>
                  <Text category="s2" style={styles.skipDescription}>
                    The meditation you are adding might not be supported yet. We
                    will try and get it added soon. Please skip to continue.
                  </Text>
                  <Button
                    onPress={onSkipPress}
                    size="small"
                    style={styles.skipButton}>
                    Skip
                  </Button>
                </Layout>
              ) : null}
            </Layout>
          </ScrollView>
          <LinearGradient
            colors={['transparent', 'transparent', '#0B0E18']}
            style={styles.bottomBarGradient}
          />
        </Layout>
        <Layout level="4" style={styles.bottomContainer}>
          <Button
            disabled={selectedMedId === EMPTY_ID}
            onPress={onContinuePress}
            size="large"
            style={styles.continueButton}>
            Continue
          </Button>
        </Layout>
        <Modal
          visible={isModalVisible}
          backdropStyle={styles.modalBackdrop}
          onBackdropPress={() => setIsModalVisible(false)}>
          <Layout level="2" style={styles.modalContainer}>
            <Layout level="2" style={styles.modalTextContainer}>
              <Text category="s1">
                The meditation you selected is currently linked to a different
                file:
              </Text>
              <Text category="s1" style={styles.modalTextFileName}>
                {existingMedLink}
              </Text>
              <Text category="s1">
                Would you like to override the file for this meditation?
              </Text>
            </Layout>
            <Button onPress={onModalConfirmPress}>Confirm Override</Button>
            <Button
              appearance="ghost"
              status="basic"
              onPress={() => setIsModalVisible(false)}
              style={styles.modalCancelButton}>
              Cancel
            </Button>
          </Layout>
        </Modal>
      </SafeAreaView>
    </Layout>
  );
};

const themedStyles = StyleSheet.create({
  bottomBarGradient: {
    height: 60,
    paddingBottom: 20,
    backgroundColor: 'transparent',
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  continueButton: {
    marginBottom: 16,
  },
  instructionText: {
    paddingBottom: 10,
    lineHeight: 22,
  },
  fileCount: {
    paddingBottom: 20,
    lineHeight: 22,
    opacity: 0.7,
  },
  fileName: {
    color: 'color-primary-200',
  },
  gradientContainer: {
    height: 40,
    backgroundColor: 'transparent',
    borderColor: 'red',
    borderWidth: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  modalBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalCancelButton: {
    marginTop: 10,
  },
  modalContainer: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 30,
    marginHorizontal: 20,
  },
  modalTextContainer: {
    marginBottom: 20,
  },
  modalTextFileName: {
    color: 'color-primary-200',
    marginVertical: 20,
  },
  safeArea: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  skipButton: {
    marginTop: 20,
  },
  skipContainer: {
    borderRadius: 10,
    marginBottom: 100,
    marginHorizontal: 20,
    padding: 20,
  },
  skipDescription: {
    textAlign: 'center',
  },
  skipHeader: {
    marginBottom: 10,
    textAlign: 'center',
  },
  topBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  topSkipText: {
    paddingHorizontal: 10,
    opacity: 0.7,
  },
});

export default MeditationMatchScreen;

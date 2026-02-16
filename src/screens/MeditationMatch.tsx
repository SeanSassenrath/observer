import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Icon, Layout, Modal, Text, useStyleSheet} from '@ui-kitten/components';
import LinearGradient from 'react-native-linear-gradient';

import {
  MeditationId,
  MeditationMatchScreenNavigationProp,
  MeditationMatchScreenRouteProp,
} from '../types';
import {SearchBar} from '../components/SearchBar';
import {sortBy} from 'lodash';
import {getFullMeditationCatalogSync} from '../services/meditationCatalog';
import Button from '../components/Button';
import MeditationFilePathsContext from '../contexts/meditationFilePaths';
import {setMeditationFilePathDataInAsyncStorage} from '../utils/asyncStorageMeditation';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

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

  const [currentFileIndex, setCurrentFileIndex] = useState(
    params?.startIndex ?? 0,
  );

  useEffect(() => {
    if (params?.startIndex !== undefined) {
      setCurrentFileIndex(params.startIndex);
      setSearchInput(EMPTY_SEARCH);
      setSelectedMedId(EMPTY_ID);
    }
  }, [params?.startIndex]);
  const [searchInput, setSearchInput] = useState(EMPTY_SEARCH);
  const [selectedMedId, setSelectedMedId] = useState(EMPTY_ID);
  const [existingMedLink, setExistingMedLink] = useState(EMPTY_ID);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const styles = useStyleSheet(themedStyles);

  const navigation = useNavigation();

  // Flatten all meditations into single array, sorted alphabetically
  const flattenedMeditations = useMemo(() => {
    const meditationBaseMap = getFullMeditationCatalogSync();
    const meditationArray = Object.keys(meditationBaseMap).map(key => ({
      id: key,
      name: meditationBaseMap[key].name,
      formattedDuration: meditationBaseMap[key].formattedDuration,
    }));
    return sortBy(meditationArray, 'name');
  }, []);

  // Filter based on search input
  const filteredMeditations = useMemo(() => {
    if (searchInput.length === 0) {
      return flattenedMeditations;
    }
    return flattenedMeditations.filter(meditation =>
      meditation.name.toLowerCase().includes(searchInput.toLowerCase()),
    );
  }, [searchInput, flattenedMeditations]);

  const onClearSearchPress = () => setSearchInput(EMPTY_SEARCH);

  const fileCount = medsFail && medsFail.length;
  const file = medsFail[currentFileIndex];
  const fileName = file.name || '';

  const existingMedLinkCheck = () => {
    const existingMedIds = Object.keys(meditationFilePaths);

    if (existingMedIds.length > 0) {
      const existingMedLinkId = existingMedIds.find(id => id === selectedMedId);

      if (existingMedLinkId) {
        const _existingMedLink = meditationFilePaths[existingMedLinkId];
        const decodedExistingMedLink = decodeURI(_existingMedLink);
        const filenameOnly = decodedExistingMedLink.split('/')[1];
        setExistingMedLink(filenameOnly);
        return filenameOnly;
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

  const renderMeditationItem = ({item, index}: {item: any; index: number}) => {
    const isSelected = item.id === selectedMedId;
    const isLastItem = index === filteredMeditations.length - 1;

    return (
      <TouchableOpacity
        style={[
          styles.meditationItem,
          isSelected && styles.selectedMeditationItem,
          isLastItem && styles.lastMeditationItem,
        ]}
        onPress={() => onMeditationPress(item.id)}>
        <Layout level="4" style={styles.meditationItemContent}>
          <Layout level="4" style={styles.meditationTextContainer}>
            <Text
              category="s1"
              style={[
                styles.meditationName,
                isSelected && styles.selectedMeditationName,
              ]}>
              {item.name}
            </Text>
          </Layout>
          {isSelected && (
            <Icon name="checkmark" style={styles.checkIcon} fill="#9C4DCC" />
          )}
        </Layout>
      </TouchableOpacity>
    );
  };

  const onCantFindPress = () => {
    navigation.navigate('SubmitMeditation', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      medsFail,
      currentFileIndex,
    });
  };

  const renderEmptyState = () => (
    <Layout level="4" style={styles.emptyStateContainer}>
      <Text category="h6" style={styles.emptyStateTitle}>
        No meditations found
      </Text>
      <Text category="s2" style={styles.emptyStateDescription}>
        Try adjusting your search terms
      </Text>
    </Layout>
  );

  return (
    <Layout level="4" style={styles.screenContainer}>
      <SafeAreaView style={styles.safeArea}>
        <Layout level="4" style={styles.topContainer}>
          <Layout level="4" style={styles.topBarContainer}>
            <Text category="s1" style={styles.fileCount}>
              File {currentFileIndex + 1} of {fileCount}
            </Text>
            <Pressable onPress={onSkipPress}>
              <Text category="s1" style={styles.skipText}>
                Skip
              </Text>
            </Pressable>
          </Layout>
          <Text category="h5" style={styles.instructionText}>
            Help us match your file
          </Text>
          <Text category="s2" style={styles.instructionText}>
            We couldn't recognize this file
            <Text category="s1" style={styles.fileName}>
              {` ${fileName}. `}
            </Text>
            Select the correct meditation below.
          </Text>
        </Layout>
        <Layout style={styles.mainContainer}>
          <Layout level="4" style={styles.searchContainer}>
            <SearchBar
              placeholder="Search Supported Meditations"
              input={searchInput}
              onChangeText={setSearchInput}
              onClearPress={onClearSearchPress}
            />
          </Layout>
          <FlatList
            data={filteredMeditations}
            keyExtractor={item => item.id}
            renderItem={renderMeditationItem}
            style={styles.meditationList}
            contentContainerStyle={styles.meditationListContent}
            ListFooterComponent={null}
            ListEmptyComponent={renderEmptyState}
            initialNumToRender={20}
            maxToRenderPerBatch={20}
            windowSize={10}
          />
          <LinearGradient
            colors={['transparent', 'transparent', '#0B0E18']}
            style={styles.bottomBarGradient}
          />
        </Layout>
        <Layout level="4" style={styles.bottomContainer}>
          <Pressable onPress={onCantFindPress} style={styles.cantFindContainer}>
            <Text category="s1" style={styles.cantFindText}>
              Can’t find it? Submit it for support.
            </Text>
          </Pressable>
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
    fontWeight: 'bold',
    opacity: 0.75,
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
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
  skipText: {
    paddingHorizontal: 10,
    opacity: 0.7,
  },
  meditationList: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  meditationListContent: {
    paddingBottom: 100,
  },
  meditationItem: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  lastMeditationItem: {
    borderBottomWidth: 0,
  },
  selectedMeditationItem: {
    backgroundColor: '#374151',
  },
  meditationItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  meditationTextContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  meditationName: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  selectedMeditationName: {
    fontWeight: '600',
    color: '#9C4DCC',
  },
  meditationDuration: {
    fontSize: 14,
    color: '#9CA3AF',
    opacity: 0.8,
  },
  checkIcon: {
    width: 20,
    height: 20,
    marginLeft: 12,
  },
  emptyStateContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  emptyStateTitle: {
    marginBottom: 8,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  emptyStateDescription: {
    color: '#9CA3AF',
    textAlign: 'center',
  },
  cantFindContainer: {
    paddingBottom: 30,
    paddingTop: 10,
    alignItems: 'center',
  },
  cantFindText: {
    color: 'color-primary-200',
  },
});

export default MeditationMatchScreen;

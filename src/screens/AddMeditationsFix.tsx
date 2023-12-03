import React, {useContext, useState} from 'react';
import {
  Autocomplete,
  AutocompleteItem,
  Icon,
  Layout,
  Modal,
  Text,
  useStyleSheet,
} from '@ui-kitten/components';
import {
  SafeAreaView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {sortBy, uniqBy} from 'lodash';

import Button from '../components/Button';
import {meditationBaseMap} from '../constants/meditation-data';
import {
  AddMedsFixScreenNavigationProp,
  AddMedsFixScreenRouteProp,
  MeditationBase,
  MeditationBaseId,
} from '../types';
import MeditationFilePathsContext from '../contexts/meditationFilePaths';
import {setMeditationFilePathDataInAsyncStorage} from '../utils/asyncStorageMeditation';
import {useNavigation} from '@react-navigation/native';
import MeditationBaseDataContext from '../contexts/meditationBaseData';
import {errorRed} from '../constants/colors';

const medNameFilter = (item: MeditationBase, query: string): boolean =>
  item.name.toLowerCase().includes(query.toLowerCase());

const ErrorIconBig = (props: any) => (
  <Icon
    {...props}
    style={iconStyles.errorIconBig}
    fill={errorRed}
    name="alert-circle-outline"
  />
);

const iconStyles = StyleSheet.create({
  errorIcon: {
    height: 30,
    width: 30,
  },
  errorIconBig: {
    height: 50,
    width: 50,
  },
});

interface FixedMeditation {
  path?: string;
  medId?: MeditationBaseId;
  name?: string;
}

interface FixedMeditationMap {
  [key: number]: FixedMeditation;
}

interface Props {
  navigation: AddMedsFixScreenNavigationProp;
  route: AddMedsFixScreenRouteProp;
}

const AddMeditationsFixScreen = (props: Props) => {
  const styles = useStyleSheet(themedStyles);
  const {route} = props;
  const {medsFail} = route.params;
  const unknownFiles = medsFail;
  const {meditationFilePaths} = useContext(MeditationFilePathsContext);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {meditationBaseData, setMeditationBaseData} = useContext(
    MeditationBaseDataContext,
  );
  const [fixedMeds, setFixedMeds] = useState({} as FixedMeditationMap);
  const [isSkipVisible, setIsSkipVisible] = useState(false);

  const navigation = useNavigation();

  const {width} = useWindowDimensions();

  const getMedOptions = () => {
    const medOptions = [];
    for (const key in meditationBaseMap) {
      const meditation = meditationBaseMap[key];
      medOptions.push(meditation);
    }

    const uniqMedOptions = uniqBy(medOptions, 'name');

    return sortBy(uniqMedOptions, 'name');
  };

  const meditationOptions = getMedOptions();

  const [optionData, setOptionData] = React.useState(meditationOptions);

  const onContinuePress = async () => {
    const matchedMeds = {} as any;

    for (const key in fixedMeds) {
      const fixedMed = fixedMeds[key];

      if (fixedMed && fixedMed.medId) {
        matchedMeds[fixedMed.medId] = fixedMed.path;
      }
    }

    if (Object.keys(matchedMeds).length <= 0) {
      // Route to confirmation page
    }

    try {
      const combinedMeds = {...meditationFilePaths, ...matchedMeds};
      await setMeditationFilePathDataInAsyncStorage(combinedMeds);
      //@ts-ignore
      navigation.navigate('TabNavigation', {screen: 'Home'});
    } catch (e) {
      console.log('Error with combining matched meditations', e);
    }
  };

  const onOpenSkipModal = () => {
    setIsSkipVisible(true);
  };

  const onCloseSkipModal = () => {
    setIsSkipVisible(false);
  };

  const onSkipConfirm = () => {
    setIsSkipVisible(false);
    //@ts-ignore
    navigation.navigate('TabNavigation', {screen: 'Home'});
  };

  const isContinueDisabled = () => {
    const medIdList = [];

    for (const key in fixedMeds) {
      if (fixedMeds[key] && fixedMeds[key].medId) {
        medIdList.push(fixedMeds[key].medId);
      }
    }

    return medIdList.length <= 0;
  };

  const renderOption = (item: any, index: any): React.ReactElement => (
    <AutocompleteItem
      key={index}
      title={item.name}
      style={{width: autocompleteWidth}}
    />
  );

  const onSelect = (index: number, key: number | null, path: string | null) => {
    if (key && path) {
      setFixedMeds({
        ...fixedMeds,
        [key]: {
          path,
          medId: optionData[index].meditationBaseId,
          name: optionData[index].name,
        },
      });
    } else {
      setFixedMeds(fixedMeds);
    }
  };

  const onChangeText = (query: string, key: number | null) => {
    if (key) {
      setFixedMeds({
        ...fixedMeds,
        [key]: {
          name: query,
        },
      });
      let filteredOptions = meditationOptions.filter(item =>
        medNameFilter(item, query),
      );

      if (filteredOptions.length <= 0) {
        filteredOptions = [
          {
            //@ts-ignore
            size: 0,
            path: '',
            name: 'Unsupported',
          },
        ];
      }

      setOptionData(filteredOptions);
    }
  };

  const getAutoCompValue = (size: number | null) => {
    if (size && fixedMeds[size]) {
      return fixedMeds[size].name;
    }
  };

  const autocompleteWidth = width > 380 ? 340 : width - 40;

  return (
    <Layout level="4" style={styles.rootContainer}>
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView style={styles.scrollView}>
          <View style={styles.topContainer}>
            <ErrorIconBig />
            <Text category="h5" style={styles.errorTitle}>
              {unknownFiles.length} files weren't recognized
            </Text>
            <Text category="s1" style={styles.errorDescription}>
              Please match the files to the correct meditation below.
            </Text>
          </View>
          <View style={styles.mainContainer}>
            {unknownFiles.length > 0 &&
              unknownFiles.map(item => {
                if (!item.name) {
                  return;
                }

                const fixedMed = item.size && fixedMeds[item.size];
                const medName = fixedMed && fixedMed.name;
                const medId = fixedMed && fixedMed.medId;
                const showNotSupportedLabel = medName && !medId;

                return (
                  <View
                    key={item.size}
                    style={{
                      ...styles.unsupportedFileViewContainer,
                      width: autocompleteWidth,
                    }}>
                    <Text category="s1" style={styles.unsupportedFileName}>
                      {item.name}
                    </Text>
                    <Autocomplete
                      placeholder="Enter meditation name"
                      value={getAutoCompValue(item.size)}
                      onSelect={(i: number) => onSelect(i, item.size, item.uri)}
                      onChangeText={(q: string) => onChangeText(q, item.size)}
                      size="large"
                      onPressIn={() => setOptionData(meditationOptions)}
                      style={{
                        ...styles.autocompleteInput,
                        width: autocompleteWidth,
                      }}>
                      {optionData.map(renderOption)}
                    </Autocomplete>
                    {showNotSupportedLabel ? (
                      <Text category="s2" style={styles.errorLabel}>
                        This meditation isn't supported yet
                      </Text>
                    ) : null}
                  </View>
                );
              })}
          </View>
        </KeyboardAwareScrollView>
        <Layout level="4" style={styles.bottom}>
          <Button
            disabled={isContinueDisabled()}
            onPress={onContinuePress}
            size="large"
            style={styles.nextButton}>
            Continue
          </Button>
          <Button
            appearance="ghost"
            onPress={onOpenSkipModal}
            size="large"
            status="basic">
            Skip
          </Button>
        </Layout>
        <Modal
          visible={isSkipVisible}
          backdropStyle={styles.backdrop}
          onBackdropPress={onCloseSkipModal}>
          <Layout level="4" style={styles.skipModalContainer}>
            <Text category="h6">Are you sure you want to skip?</Text>
            <View>
              <Button style={styles.skipButton} onPress={onSkipConfirm}>
                Skip
              </Button>
              <Button
                appearance="ghost"
                status="basic"
                onPress={onCloseSkipModal}>
                Cancel
              </Button>
            </View>
          </Layout>
        </Modal>
      </SafeAreaView>
    </Layout>
  );
};

const themedStyles = StyleSheet.create({
  scrollView: {
    height: '100%',
  },
  topContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 60,
    paddingTop: 40,
  },
  errorIconBig: {
    height: 50,
    width: 50,
  },
  errorTitle: {
    paddingVertical: 10,
  },
  errorDescription: {
    paddingVertical: 5,
    opacity: 0.9,
    textAlign: 'center',
  },
  mainContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  unsupportedFileViewContainer: {
    marginBottom: 80,
  },
  autocompleteInput: {
    marginTop: 10,
  },
  errorLabel: {
    marginTop: 10,
    color: errorRed,
  },
  skipModalContainer: {
    height: 220,
    width: 360,
    borderRadius: 10,
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipButton: {
    marginBottom: 20,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  bottom: {
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
  rootContainer: {
    flex: 1,
  },
  searchBar: {
    backgroundColor: 'rgba(48,55,75,0.6)',
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

export default AddMeditationsFixScreen;

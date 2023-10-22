import React, {useContext, useEffect, useState} from 'react';
import {
  Autocomplete,
  AutocompleteItem,
  Icon,
  Text,
  useStyleSheet,
} from '@ui-kitten/components';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {SearchBar} from '../components/SearchBar';
import {sortBy, uniqBy} from 'lodash';

import Button from '../components/Button';
import UnsupportedFilesContext from '../contexts/unsupportedFiles';
import {meditationBaseMap} from '../constants/meditation-data';
import {MeditationBase, MeditationBaseId, UnsupportedFileData} from '../types';
import MeditationFilePathsContext from '../contexts/meditationFilePaths';
import {setMeditationFilePathDataInAsyncStorage} from '../utils/asyncStorageMeditation';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import MeditationBaseDataContext from '../contexts/meditationBaseData';
import {makeMeditationBaseData} from '../utils/meditation';

const testFilter = (item, query): boolean =>
  item.name.toLowerCase().includes(query.toLowerCase());

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

// interface MeditationOptionProps {
//   name: string;
//   selected: boolean;
//   onPress(): void;
// }

// const MeditationOption = (props: MeditationOptionProps) => {
//   const {name, onPress, selected} = props;
//   return (
//     <Pressable onPress={onPress}>
//       <View
//         style={
//           selected
//             ? MeditationOptionStyles.meditationSelected
//             : MeditationOptionStyles.meditationDefault
//         }>
//         <Text category="h6" style={MeditationOptionStyles.text}>
//           {name}
//         </Text>
//         {/* <View style={MeditationOptionStyles.statusContainer}>
//           <View
//             level="4"
//             style={
//               selected
//                 ? MeditationOptionStyles.statusSelected
//                 : MeditationOptionStyles.statusDefault
//             }
//           />
//         </View> */}
//       </View>
//     </Pressable>
//   );
// };

// const MeditationOptionStyles = StyleSheet.create({
//   meditationDefault: {
//     borderBottomColor: '#f3f3f3',
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 20,
//     opacity: 0.5,
//   },
//   meditationSelected: {
//     borderBottomColor: '#f3f3f3',
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 20,
//     opacity: 1,
//   },
//   statusDefault: {
//     borderWidth: 1,
//     borderColor: 'white',
//     borderRadius: 50,
//     height: 25,
//     width: 25,
//   },
//   statusSelected: {
//     backgroundColor: 'green',
//     borderWidth: 2,
//     borderColor: 'green',
//     borderRadius: 50,
//     height: 25,
//     width: 25,
//   },
//   statusContainer: {
//     flex: 1,
//     marginLeft: 20,
//   },
//   text: {
//     flex: 9,
//     fontSize: 16,
//   },
// });
interface FixedMeditation {
  path?: string;
  medId?: MeditationBaseId;
  name?: string;
}

interface FixedMeditationMap {
  [key: number]: FixedMeditation;
}

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
  // const [isModalVisible, setIsModalVisible] = useState(true);
  const [fixedMeds, setFixedMeds] = useState({} as FixedMeditationMap);

  const styles = useStyleSheet(themedStyles);
  const navigation = useNavigation();
  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 2];

  // const onSearchClearPress = () => setSearchInput(EMPTY_SEARCH);
  // const onMeditationOptionPress = (meditationBase: MeditationBase) => {
  //   if (selectedMeditationOption === meditationBase.meditationBaseId) {
  //     setSelectedMeditationOption(EMPTY_SELECTED_OPTION);
  //   } else {
  //     setSelectedMeditationOption(meditationBase.meditationBaseId);
  //   }
  // };

  const getMeditationOptions = () => {
    const meditationOptions = [];
    for (const key in meditationBaseMap) {
      const meditation = meditationBaseMap[key];
      if (meditation.name.includes(searchInput)) {
        meditationOptions.push(meditation);
      }
    }

    const uniqueNames = uniqBy(meditationOptions, 'name');

    return sortBy(uniqueNames, 'name');
  };

  const [value, setValue] = React.useState('');
  const meditationOptions = getMeditationOptions();

  const [data, setData] = React.useState(meditationOptions);

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
  // const currentUnsupportedFileName =
  //   unsupportedFiles[unsupportedFileIndex]?.name;

  const renderOption = (item: any, index: any): React.ReactElement => (
    <AutocompleteItem
      key={index}
      title={item.name}
      style={styles.autocompleteDropdown}
    />
  );

  const onSelect = (index: number, key: number | null, path: string | null) => {
    if (key && path) {
      setFixedMeds({
        ...fixedMeds,
        [key]: {
          path,
          medId: data[index].meditationBaseId,
          name: data[index].name,
        },
      });
      setData(meditationOptions);
    } else {
      setFixedMeds(fixedMeds);
    }
    // setValue(data[index].name);
  };

  const onChangeText = (query: string, key: number | null) => {
    if (key) {
      setFixedMeds({
        ...fixedMeds,
        [key]: {
          ...fixedMeds[key],
          name: query,
        },
      });
      const filteredOptions = meditationOptions.filter(item =>
        testFilter(item, query),
      );
      console.log('Test 4 >>> value', filteredOptions);
      setData(filteredOptions);
    }
  };

  useEffect(() => {
    console.log('fixedMeds', fixedMeds);
  }, [fixedMeds]);

  const getAutoCompValue = (size: number | null) => {
    if (size && fixedMeds[size]) {
      return fixedMeds[size].name;
    }
  };

  return (
    <View style={styles.rootContainer}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.topContainer}>
            <ErrorIconBig />
            <Text category="h5" style={styles.errorTitle}>
              We failed to recognize {unsupportedFiles.length} files.
            </Text>
            <Text category="s1" style={styles.errorDescription}>
              Please match the files to the correct meditation below.
            </Text>
          </View>
          <View style={styles.mainContainer}>
            {unsupportedFiles.length > 0 &&
              unsupportedFiles.map(item => {
                if (!item.name) {
                  return;
                }

                return (
                  <View
                    key={item.size}
                    style={styles.unsupportedFileViewContainer}>
                    <Text category="s1" style={styles.unsupportedFileName}>
                      {item.name}
                    </Text>
                    <Autocomplete
                      placeholder="Enter meditation name"
                      value={getAutoCompValue(item.size)}
                      onSelect={(i: number) => onSelect(i, item.size, item.uri)}
                      onChangeText={(q: string) => onChangeText(q, item.size)}
                      size="large"
                      style={styles.autocompleteInput}>
                      {data.map(renderOption)}
                    </Autocomplete>
                  </View>
                );
              })}
          </View>
        </ScrollView>
        {/* <View style={styles.top}> */}
        {/* <View style={styles.topContentContainer}>
            <ErrorIcon />
            <Text category="h6" style={styles.topText}>
              File not recognized ({unsupportedFileIndex + 1}&nbsp;of&nbsp;
              {unsupportedFiles.length})
            </Text>
          </View>
        </View>
        <View style={styles.middle}>
          <Text category="h5">Which meditation is this?</Text>
          <View style={styles.unsupportedFileContainer}>
            <Text category="s1" style={styles.unsupportedFileName}>
              File: {currentUnsupportedFileName || ''}
            </Text>
          </View> */}
        {/* <Text category="h5">Which meditation is this?</Text> */}
        {/* <SearchBar
            placeholder="Enter meditation name"
            input={searchInput}
            onChangeText={setSearchInput}
            onClearPress={onSearchClearPress}
            style={styles.searchBar}
          /> */}
        {/* <ScrollView>
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
                <View style={styles.noResultsContainer}>
                  <Text category="s1" style={styles.noResults}>
                    It looks like we don't support this meditation yet.
                  </Text>
                  <Text category="s1" style={styles.noResults}>
                    Double check the spelling or press skip to continue.
                  </Text>
                </View>
              )
            ) : null}
          </ScrollView> */}
        {/* </View> */}
        <View style={styles.bottom}>
          <Button
            disabled={!selectedMeditationOption.length || !searchInput.length}
            onPress={onNextPress}
            size="large"
            style={styles.nextButton}>
            Continue
          </Button>
          <Button
            appearance="ghost"
            onPress={onSkipPress}
            size="large"
            status="basic">
            Skip
          </Button>
        </View>
      </SafeAreaView>
    </View>
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
    width: 380,
  },
  autocompleteInput: {
    marginTop: 10,
    width: 380,
  },
  autocompleteDropdown: {
    width: 380,
  },
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
  rootContainer: {
    backgroundColor: '#0B0E18',
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

export default FixMeditationScreen;

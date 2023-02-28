import React, { useContext, useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import { Icon, Layout, Text, useStyleSheet } from '@ui-kitten/components';

import { MeditationList } from '../components/MeditationList';
import { meditationBaseMap } from '../constants/meditation';
import { MeditationScreenNavigationProp, MeditationId } from '../types';
import { makeMeditationGroups, MeditationGroupMap } from '../utils/meditation';
import { SearchBar } from '../components/SearchBar';
import MeditationBaseDataContext from '../contexts/meditationBaseData';
import { onAddMeditations } from '../utils/addMeditations';
import { MeditationFilePathData } from '../utils/asyncStorageMeditation';

const EMPTY_SEARCH = '';
const lightWhite = '#f3f3f3';

const PlusIcon = (props: any) => (
  <Icon {...props} style={themedStyles.plusIcon} fill={lightWhite} name='plus-outline' />
);

const LibraryScreen = () => {
  const [existingMediationFilePathData, setExistingMeditationFilePathData] = useState({} as MeditationFilePathData);
  const { meditationBaseData, setMeditationBaseData } = useContext(MeditationBaseDataContext);
  const [meditationGroups, setMeditationGroups] = useState({} as MeditationGroupMap)
  const [searchInput, setSearchInput] = useState(EMPTY_SEARCH)
  const navigation = useNavigation<MeditationScreenNavigationProp>();
  const styles = useStyleSheet(themedStyles);

  useEffect(() => {
    const meditationGroups = makeMeditationGroups(meditationBaseData);
    setMeditationGroups(meditationGroups);
  }, [meditationBaseData]);

  // const onAddPress = async () => {
  //   // const pickedFileData = await pickFilesFromDevice()
  //   if (!pickedFileData) { return null; }

  //   if (
  //     pickedFileData.updatedUnlockedMeditationIds.length <= 0 &&
  //     pickedFileData.unsupportedFileNames.length > 0
  //   ) {
  //     // setScreenState(ScreenState.Fail);
  //   } else if (
  //     pickedFileData.updatedUnlockedMeditationIds.length > 0 &&
  //     pickedFileData.unsupportedFileNames.length > 0
  //   ) {
  //     setUnlockedMeditationIdsInAsyncStorage(
  //       pickedFileData.updatedUnlockedMeditationIds,
  //     )
  //     setUnlockedMeditationIds(pickedFileData.updatedUnlockedMeditationIds)
  //     // setScreenState(ScreenState.Mixed);
  //   } else if (
  //     pickedFileData.updatedUnlockedMeditationIds.length > 0 &&
  //     pickedFileData.unsupportedFileNames.length <= 0
  //   ) {
  //     setUnlockedMeditationIdsInAsyncStorage(
  //       pickedFileData.updatedUnlockedMeditationIds,
  //     )
  //     setUnlockedMeditationIds(pickedFileData.updatedUnlockedMeditationIds)
  //     // setScreenState(ScreenState.Success);
  //   }
  // }
  
  const onMeditationPress = (meditationBaseId: MeditationId) => {
    if (meditationBaseId) {
      navigation.navigate('Meditation', {
        id: meditationBaseId,
      });
    }
  }

  const onClearPress = () => setSearchInput(EMPTY_SEARCH);

  const filterBySearch = (searchInput: string, meditationBaseIds: MeditationId[]) => {
    const filteredIdList = meditationBaseIds.filter((meditationBaseId) => {
      const meditation = meditationBaseMap[meditationBaseId];
      if (_.startsWith(meditation.name.toLowerCase(), searchInput.toLowerCase())) {
        return meditationBaseId;
      }
    })
    return filteredIdList;
  }

  const renderMeditationGroupSections = () => {
    const meditationGroupsList = Object.entries(meditationGroups)
    return meditationGroupsList.map(([key, meditationBaseIds]) => {
      let _meditationBaseIds = meditationBaseIds;
      _meditationBaseIds = filterBySearch(searchInput, meditationBaseIds);
      const firstMeditationId = _.head(_meditationBaseIds)
      if (!firstMeditationId || !_meditationBaseIds) { return null; }
      const firstMeditation = meditationBaseMap[firstMeditationId];

      return (
        <MeditationList
          key={firstMeditation.groupName}
          header={firstMeditation.groupName}
          meditationBaseIds={_meditationBaseIds}
          onMeditationPress={onMeditationPress}
        />
      )
    })
  }

  const onAddMeditationsPress = async () => {
    const meditations = await onAddMeditations(
      existingMediationFilePathData,
      setExistingMeditationFilePathData,
    )
    if (meditations) {
      setMeditationBaseData(meditations);
    }
  }

  return (
    <Layout style={styles.rootContainer} level='4'>
      <SafeAreaView style={styles.rootContainer}>
        <ScrollView>
          <Layout style={styles.screenContainer} level='4'>
            <Layout style={styles.inputContainer} level='4'>
              <SearchBar
                input={searchInput}
                onChangeText={setSearchInput}
                onClearPress={onClearPress}
              />
            </Layout>
            {renderMeditationGroupSections()}
          </Layout>
        </ScrollView>
        <Pressable onPress={onAddMeditationsPress}>
          <Layout style={styles.addMeditationsButton}>
            <PlusIcon />
          </Layout>
        </Pressable>
      </SafeAreaView>
    </Layout>
  )
}

const themedStyles = StyleSheet.create({
  addMeditationsButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'color-primary-500',
    position: 'absolute',
    bottom: 25,
    right: 20,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMeditationsText: {
    opacity: 0.8,
  },
  addIcon: {
    height: 25,
    width: 25,
  },
  inputContainer: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  rootContainer: {
    flex: 1,
  },
  screenContainer: {
    paddingTop: 40,
    paddingBottom: 60,
  },
  plusIcon: {
    height: 35,
    width: 35,
  }
})

export default LibraryScreen;
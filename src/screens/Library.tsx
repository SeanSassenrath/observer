import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import { Icon, Input, Layout } from '@ui-kitten/components';

import { MeditationList } from '../components/MeditationList';
import { meditationBaseMap } from '../constants/meditation';
import UnlockedMeditationIdsContext from '../contexts/meditationData';
import { MeditationScreenNavigationProp, MeditationId } from '../types';
import { makeMeditationGroups, MeditationGroupMap } from '../utils/meditation';
import { setUnlockedMeditationIdsInAsyncStorage } from '../utils/filePicker';
import { SearchBar } from '../components/SearchBar';
import MeditationBaseDataContext from '../contexts/meditationBaseData';

const AddIcon = (props: any) => (
  <Icon {...props} style={styles.addIcon} fill='#9147BB' name='plus-circle-outline' />
);

const EMPTY_SEARCH = '';

const LibraryScreen = () => {
  const { unlockedMeditationIds, setUnlockedMeditationIds } = useContext(UnlockedMeditationIdsContext);
  const { meditationBaseData } = useContext(MeditationBaseDataContext);
  const [meditationGroups, setMeditationGroups] = useState({} as MeditationGroupMap)
  const [searchInput, setSearchInput] = useState(EMPTY_SEARCH)
  const navigation = useNavigation<MeditationScreenNavigationProp>();

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

  return (
    <Layout style={styles.rootContainer} level='4'>
      <SafeAreaView style={styles.rootContainer}>
        <ScrollView>
            {/* <Layout style={styles.headerContainer}>
              <TouchableWithoutFeedback
                onPress={onAddPress}
              >
                <AddIcon />
              </TouchableWithoutFeedback>
              <Avatar source={require('../assets/avatar.jpeg')} />
            </Layout> */}
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
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  addIcon: {
    height: 25,
    width: 25,
  },
  inputContainer: {
    marginHorizontal: 20,
    marginBottom: 60,
  },
  rootContainer: {
    flex: 1,
  },
  screenContainer: {
    paddingTop: 40,
  },
})

export default LibraryScreen;
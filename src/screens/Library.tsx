import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import { Icon, Layout } from '@ui-kitten/components/ui';

import { MeditationList } from '../components/MeditationList';
import { meditationMap } from '../constants/meditation';
import UnlockedMeditationIdsContext from '../contexts/meditationData';
import { MeditationScreenNavigationProp, MeditationId } from '../types';
import { makeMeditationGroups, MeditationGroupMap } from '../utils/meditation';
import { pickFilesFromDevice, setUnlockedMeditationIdsInAsyncStorage } from '../utils/filePicker';

const AddIcon = (props: any) => (
  <Icon {...props} style={styles.addIcon} fill='#9147BB' name='plus-circle-outline' />
);

const LibraryScreen = () => {
  const { unlockedMeditationIds, setUnlockedMeditationIds } = useContext(UnlockedMeditationIdsContext);
  const [meditationGroups, setMeditationGroups] = useState({} as MeditationGroupMap)
  const navigation = useNavigation<MeditationScreenNavigationProp>();

  useEffect(() => {
    const meditationGroups = makeMeditationGroups(unlockedMeditationIds);
    setMeditationGroups(meditationGroups);
  }, [unlockedMeditationIds]);

  const onAddPress = async () => {
    const pickedFileData = await pickFilesFromDevice()
    if (!pickedFileData) { return null; }

    if (
      pickedFileData.updatedUnlockedMeditationIds.length <= 0 &&
      pickedFileData.unsupportedFileNames.length > 0
    ) {
      // setScreenState(ScreenState.Fail);
    } else if (
      pickedFileData.updatedUnlockedMeditationIds.length > 0 &&
      pickedFileData.unsupportedFileNames.length > 0
    ) {
      setUnlockedMeditationIdsInAsyncStorage(
        pickedFileData.updatedUnlockedMeditationIds,
      )
      setUnlockedMeditationIds(pickedFileData.updatedUnlockedMeditationIds)
      // setScreenState(ScreenState.Mixed);
    } else if (
      pickedFileData.updatedUnlockedMeditationIds.length > 0 &&
      pickedFileData.unsupportedFileNames.length <= 0
    ) {
      setUnlockedMeditationIdsInAsyncStorage(
        pickedFileData.updatedUnlockedMeditationIds,
      )
      setUnlockedMeditationIds(pickedFileData.updatedUnlockedMeditationIds)
      // setScreenState(ScreenState.Success);
    }
  }
  
  const onMeditationPress = (meditationId: MeditationId) => {
    if (meditationId) {
      navigation.navigate('Meditation', {
        id: meditationId,
      });
    }
  }

  const renderMeditationGroupSections = () => {
    const meditationGroupsList = Object.entries(meditationGroups)
    return meditationGroupsList.map(([key, meditationIds]) => {
      const firstMeditationId = _.head(meditationIds)
      if (!firstMeditationId) { return null; }
      const firstMeditation = meditationMap[firstMeditationId];

      return (
        <MeditationList
          key={firstMeditation.groupName}
          header={firstMeditation.groupName}
          meditationIds={meditationIds}
          onMeditationPress={onMeditationPress}
        />
      )
    })
  }

  return (
    <Layout style={styles.rootContainer}>
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
          <Layout style={styles.libraryContainer}>
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
  libraryContainer: {
    paddingTop: 60,
  },
  rootContainer: {
    flex: 1,
  },
})

export default LibraryScreen;
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import { Icon, Layout, Text } from '@ui-kitten/components/ui';

import { makeMeditationGroups, MeditationGroupMap } from '../utils/meditation';
import UnlockedMeditationIdsContext from '../contexts/meditationData';
import { meditationMap } from '../constants/meditation';
import { MeditationScreenNavigationProp, MeditationId } from '../types';
import { pickFilesFromDevice, setUnlockedMeditationIdsInAsyncStorage } from '../utils/filePicker';
import { CardV2 } from '../components/Card';

const AddIcon = (props: any) => (
  <Icon {...props} style={styles.faceIcon} fill='#9147BB' name='plus-circle-outline' />
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
  
  const onMeditationClick = (meditationId: MeditationId) => {
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
        <Layout key={firstMeditation.groupKey} style={styles.section}>
          <Text category='h6' style={styles.groupHeader}>{firstMeditation.groupName}</Text>
          <ScrollView horizontal={true} style={styles.horizontalContainer}>
            {meditationIds.map((meditationId, i) => {
              const meditation = meditationMap[meditationId];
              return (
                <CardV2
                  formattedDuration={meditation.formattedDuration}
                  name={meditation.name}
                  id={meditation.meditationId}
                  key={meditation.meditationId}
                  isFirstCard
                  level='2'
                />
              )
            }
            )}
          </ScrollView>
        </Layout>
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
  card: {
    backgroundColor: '#31384b',
    width: 200,
    height: 150,
    borderRadius: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  cardContainer: {
    marginRight: 20,
    width: 200,
  },
  firstCardContainer: {
    marginRight: 20,
    marginLeft: 20,
    width: 200,
  },
  faceIcon: {
    height: 35,
    width: 35,
  },
  groupHeader: {
    paddingHorizontal: 20,
    width: 300,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  headerText: {
    padding: 2,
  },
  horizontalContainer: {
    paddingLeft: 20,
    paddingVertical: 24,
  },
  libraryContainer: {
    paddingTop: 20,
  },
  meditationData: {
    marginVertical: 8,
  },
  meditationName: {
    lineHeight: 22,
  },
  section: {
    marginVertical: 10,
  },
  rootContainer: {
    flex: 1,
  },
})

export default LibraryScreen;
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon, Layout, Text, useStyleSheet } from '@ui-kitten/components';

import { MeditationList } from '../components/MeditationList';
import { MeditationScreenNavigationProp, MeditationId } from '../types';
import { makeMeditationGroups2, MeditationGroupsList } from '../utils/meditation';
import { SearchBar } from '../components/SearchBar';
import MeditationBaseDataContext from '../contexts/meditationBaseData';
import { onAddMeditations } from '../utils/addMeditations';
import { MeditationFilePathData } from '../utils/asyncStorageMeditation';
import { meditationBaseMap } from '../constants/meditation';
import { AddMeditationsPill } from '../components/AddMeditationsPill';
import { EduPromptComponent } from '../components/EduPrompt/component';
import UserContext from '../contexts/userData';
import { fbUpdateUser } from '../fb/user';
import MeditationFilePathsContext from '../contexts/meditationFilePaths';
import UnsupportedFilesContext from '../contexts/unsupportedFiles';
import UnsupportedFilesModal from '../components/UnsupportedFilesModal';
import { sortBy, uniq } from 'lodash';

const EMPTY_SEARCH = '';

const LibraryIcon = (props: any) => (
  <Icon {...props} name='book-open-outline' />
);

const LibraryScreen = () => {
  const { user, setUser } = useContext(UserContext);
  const { meditationFilePaths, setMeditationFilePaths } = useContext(MeditationFilePathsContext);
  const { meditationBaseData, setMeditationBaseData } = useContext(MeditationBaseDataContext);
  const { unsupportedFiles, setUnsupportedFiles } = useContext(UnsupportedFilesContext);
  const [meditationGroupsList, setMeditationGroupsList] = useState([] as MeditationGroupsList)
  const [searchInput, setSearchInput] = useState(EMPTY_SEARCH)
  const navigation = useNavigation<MeditationScreenNavigationProp>();
  const styles = useStyleSheet(themedStyles);

  useEffect(() => {
    const meditationGroups = makeMeditationGroups2(meditationBaseData);
    setMeditationGroupsList(meditationGroups);
  }, [meditationBaseData]);
  
  const onMeditationPress = (meditationBaseId: MeditationId) => {
    if (meditationBaseId) {
      navigation.navigate('Meditation', {
        id: meditationBaseId,
      });
    }
  }

  const onClearPress = () => setSearchInput(EMPTY_SEARCH);

  const filterBySearch2 = (searchInput: string, meditationGroupsList: MeditationGroupsList) => {
    if (!searchInput) {
      return meditationGroupsList;
    }

    const filteredMeditationGroupsList = meditationGroupsList.map((group, index) => {
      const key = Object.keys(group)[0];
      const meditations = group[key];
      const filteredMeditations = meditations.filter((meditation) => {
        if (meditation.name.includes(searchInput)) {
          return meditation;
        }
      })

      return ({ [key]: filteredMeditations });
    })

    return filteredMeditationGroupsList || [];
  }

  const renderMeditationGroupSections = () => {
    const filteredMeditations = filterBySearch2(searchInput, meditationGroupsList);

    return filteredMeditations.map((group) => {
      const meditations = Object.values(group)[0];
      if (meditations.length <= 0) {
        return null;
      }
      const firstMeditation = meditations[0];
      const meditationBaseIds = meditations.map((meditationBase) => meditationBase['meditationBaseId']);

      //TODO Fix Meditation list to take meditations not meditation ids
      return (
        <MeditationList
          key={firstMeditation.groupName}
          header={firstMeditation.groupName}
          meditationBaseIds={meditationBaseIds}
          onMeditationPress={onMeditationPress}
        />
      )
    })
  }

  const onAddMeditationsPress = async () => {
    const meditations = await onAddMeditations(
      meditationFilePaths,
      setMeditationFilePaths,
      setUnsupportedFiles,
    )
    if (meditations) {
      setMeditationBaseData(meditations);
    }
  }

  const onEduClosePress = async () => {
    await fbUpdateUser(user.uid,
      { 'onboarding.hasSeenLibraryOnboarding': true }
    )
    setUser({
      ...user,
      onboarding: {
        ...user.onboarding,
        hasSeenLibraryOnboarding: true,
      }
    })
  }

  const renderSupportedMeditations = () => {
    const nameList = [];
    const names = {} as any;

    for (const key in meditationBaseMap) {
      const meditationName = meditationBaseMap[key].name;

      if (!names[meditationName]) {
        names[meditationName] = true;
        nameList.push({ meditationName, key });
      }
    }

    const sortedNameList = sortBy(nameList, 'meditationName');

    return sortedNameList.map(({ meditationName, key }) => {
      return (
        <Text
          category='s1'
          key={key}
          style={styles.supportedName}
        >
          {meditationName}
        </Text>
      )
    })
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
          <Layout level='2' style={styles.supportedContainer}>
            <Text category='h6' style={styles.supportedHeader}>Currently Supported Meditations</Text>
            {renderSupportedMeditations()}
          </Layout>
        </ScrollView>
        <AddMeditationsPill onAddMeditationsPress={onAddMeditationsPress}/>
      </SafeAreaView>
      {!user.onboarding.hasSeenLibraryOnboarding
        ? <EduPromptComponent
            description="Meditations have been added to your Library! You can use the Library to find, start, and add meditations."
            onPress={onEduClosePress}
            renderIcon={(props: any) => <LibraryIcon {...props} />}
            title="Your Library"
          />
        : null
      }
      {unsupportedFiles.length > 0
        ? <UnsupportedFilesModal />
        : null
      }
    </Layout>
  )
}

const themedStyles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  rootContainer: {
    flex: 1,
  },
  screenContainer: {
    paddingTop: 40,
  },
  plusIcon: {
    height: 25,
    width: 25,
    marginRight: 4,
  },
  supportedContainer: {
    marginBottom: 100,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
  },
  supportedHeader: {
    marginBottom: 30,
    opacity: 0.8,
    color: '#A1E66F'
  },
  supportedName: {
    marginBottom: 18,
    opacity: 0.8,
  }
})

export default LibraryScreen;
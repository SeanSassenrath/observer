import React, {useContext, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Icon, Layout, useStyleSheet} from '@ui-kitten/components';

import {_MeditationListSection} from '../components/MeditationList';
import {
  MeditationScreenNavigationProp,
  MeditationId,
  MeditationBaseMap,
  MeditationBase,
} from '../types';
import {SearchBar} from '../components/SearchBar';
import MeditationBaseDataContext from '../contexts/meditationBaseData';
import {onAddMeditations} from '../utils/addMeditations';
import {
  MeditationGroupName,
  botecMap,
  breakingHabitMap,
  breathMap,
  dailyMeditationsMap,
  foundationalMap,
  generatingMap,
  otherMap,
  synchronizeMap,
  unlockedMap,
  walkingMap,
} from '../constants/meditation-data';
import {AddMeditationsPill} from '../components/AddMeditationsPill';
import {EduPromptComponent} from '../components/EduPrompt/component';
import UserContext from '../contexts/userData';
import {fbUpdateUser} from '../fb/user';
import MeditationFilePathsContext from '../contexts/meditationFilePaths';
import UnsupportedFilesContext from '../contexts/unsupportedFiles';
import UnsupportedFilesModal from '../components/UnsupportedFilesModal';
import {sortBy} from 'lodash';

const EMPTY_SEARCH = '';

const LibraryIcon = (props: any) => (
  <Icon {...props} name="book-open-outline" />
);

const LibraryScreen = () => {
  const {user, setUser} = useContext(UserContext);
  const {meditationFilePaths, setMeditationFilePaths} = useContext(
    MeditationFilePathsContext,
  );
  const {meditationBaseData, setMeditationBaseData} = useContext(
    MeditationBaseDataContext,
  );
  const {unsupportedFiles, setUnsupportedFiles} = useContext(
    UnsupportedFilesContext,
  );
  const [searchInput, setSearchInput] = useState(EMPTY_SEARCH);
  const navigation = useNavigation<MeditationScreenNavigationProp>();
  const styles = useStyleSheet(themedStyles);

  const onMeditationPress = (meditationBaseId: MeditationId) => {
    if (meditationBaseId) {
      navigation.navigate('Meditation', {
        id: meditationBaseId,
      });
    }
  };

  const onClearPress = () => setSearchInput(EMPTY_SEARCH);

  const onAddMeditationsPress = async () => {
    const meditations = await onAddMeditations(
      meditationFilePaths,
      setMeditationFilePaths,
      setUnsupportedFiles,
      user,
    );
    if (meditations) {
      setMeditationBaseData(meditations);
    }
  };

  const onEduClosePress = async () => {
    await fbUpdateUser(user.uid, {'onboarding.hasSeenLibraryOnboarding': true});
    setUser({
      ...user,
      onboarding: {
        ...user.onboarding,
        hasSeenLibraryOnboarding: true,
      },
    });
  };

  const renderMeditationGroupSection = (
    header: string,
    meditationGroupMap: MeditationBaseMap,
  ) => {
    const meditationList = [] as MeditationBase[];
    const meditationGroupKeys = Object.keys(meditationGroupMap);
    meditationGroupKeys.forEach(key => {
      if (meditationBaseData[key]) {
        if (searchInput.length > 0) {
          if (meditationBaseData[key].name.includes(searchInput)) {
            return meditationList.push(meditationBaseData[key]);
          }
        } else {
          meditationList.push(meditationBaseData[key]);
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
      />
    );
  };

  return (
    <Layout style={styles.rootContainer} level="4">
      <SafeAreaView style={styles.rootContainer}>
        <ScrollView>
          <Layout style={styles.screenContainer} level="4">
            <Layout style={styles.inputContainer} level="4">
              <SearchBar
                input={searchInput}
                onChangeText={setSearchInput}
                onClearPress={onClearPress}
              />
            </Layout>
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
            {renderMeditationGroupSection(MeditationGroupName.Other, otherMap)}
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
          </Layout>
        </ScrollView>
        <AddMeditationsPill onAddMeditationsPress={onAddMeditationsPress} />
      </SafeAreaView>
      {!user.onboarding.hasSeenLibraryOnboarding ? (
        <EduPromptComponent
          description="Meditations have been added to your Library! You can use the Library to find, start, and add meditations."
          onPress={onEduClosePress}
          renderIcon={(props: any) => <LibraryIcon {...props} />}
          title="Your Library"
        />
      ) : null}
      {unsupportedFiles.length > 0 ? <UnsupportedFilesModal /> : null}
    </Layout>
  );
};

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
    color: '#A1E66F',
  },
  supportedName: {
    marginBottom: 18,
    opacity: 0.8,
  },
});

export default LibraryScreen;

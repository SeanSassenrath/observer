import React, {useContext, useState} from 'react';
import {Dimensions, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
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
import {sortBy} from 'lodash';
import LinearGradient from 'react-native-linear-gradient';

const EMPTY_SEARCH = '';

const screenHeight = Dimensions.get('screen').height;

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    const {_meditations, _unsupportedFiles} = await onAddMeditations(
      meditationFilePaths,
      setMeditationFilePaths,
      setUnsupportedFiles,
      user,
    );

    if (_unsupportedFiles.length) {
      navigation.navigate('FixMeditation');
    } else if (_meditations) {
      setMeditationBaseData(_meditations);
      //@ts-ignore
      navigation.navigate('TabNavigation', {screen: 'Library'});
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
    <Layout style={styles.rootContainer}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollContainer}>
          <LinearGradient colors={['#020306', '#1B0444']}>
            <Layout style={styles.screenContainer}>
              <Layout style={styles.inputContainer}>
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
            </Layout>
          </LinearGradient>
        </ScrollView>
      </SafeAreaView>

      <AddMeditationsPill onAddMeditationsPress={onAddMeditationsPress} />
      {!user.onboarding.hasSeenLibraryOnboarding ? (
        <EduPromptComponent
          description="Meditations have been added to your Library! You can use the Library to find, start, and add meditations."
          onPress={onEduClosePress}
          renderIcon={(props: any) => <LibraryIcon {...props} />}
          title="Your Library"
        />
      ) : null}
    </Layout>
  );
};

const themedStyles = StyleSheet.create({
  inputContainer: {
    backgroundColor: 'transparent',
    marginHorizontal: 20,
    marginBottom: 40,
  },
  rootContainer: {
    backgroundColor: '#020306',
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    minHeight: screenHeight,
    backgroundColor: 'transparent',
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
  scrollContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});

export default LibraryScreen;

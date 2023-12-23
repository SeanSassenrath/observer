import React, {useState} from 'react';
import {Layout, Text, useStyleSheet} from '@ui-kitten/components';

import {
  MeditationBase,
  MeditationBaseMap,
  MeditationMatchScreenNavigationProp,
  MeditationMatchScreenRouteProp,
} from '../types';
import {SearchBar} from '../components/SearchBar';
import {_MeditationListSection} from '../components/MeditationList';
import {sortBy} from 'lodash';
import {
  MeditationGroupName,
  botecMap,
  breakingHabitMap,
  breathMap,
  dailyMeditationsMap,
  foundationalMap,
  generatingMap,
  meditationBaseMap,
  otherMap,
  synchronizeMap,
  unlockedMap,
  walkingMap,
} from '../constants/meditation-data';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';

const EMPTY_SEARCH = '';

interface Props {
  navigation: MeditationMatchScreenNavigationProp;
  route: MeditationMatchScreenRouteProp;
}

const MeditationMatchScreen = (props: Props) => {
  const {route} = props;
  const params = route && route.params;
  const medsFail = params && params.medsFail;

  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [searchInput, setSearchInput] = useState(EMPTY_SEARCH);
  const styles = useStyleSheet(themedStyles);

  const onClearSearchPress = () => setSearchInput(EMPTY_SEARCH);

  const fileCount = medsFail && medsFail.length;
  // const file = medsFail[currentFileIndex];
  // const fileName = file.name || '';
  const fileName = 'file-name-here';

  const renderMeditationGroupSection = (
    header: string,
    meditationGroupMap: MeditationBaseMap,
  ) => {
    const meditationList = [] as MeditationBase[];
    const meditationGroupKeys = Object.keys(meditationGroupMap);
    meditationGroupKeys.forEach(key => {
      if (meditationBaseMap[key]) {
        if (searchInput.length > 0) {
          if (meditationBaseMap[key].name.includes(searchInput)) {
            return meditationList.push(meditationBaseMap[key]);
          }
        } else {
          meditationList.push(meditationBaseMap[key]);
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
        onMeditationPress={() => console.log('Press')}
      />
    );
  };

  return (
    <Layout level="4" style={styles.screenContainer}>
      <SafeAreaView style={styles.safeArea}>
        <Layout level="4" style={styles.topContainer}>
          <Text category="s1" style={styles.instructionText}>
            File {currentFileIndex + 1} of {fileCount}
          </Text>
          <Text category="s1" style={styles.instructionText}>
            Select the meditation below that matches this file:
          </Text>
          <Text category="h6" style={styles.fileName}>
            {fileName}
          </Text>
        </Layout>
        <Layout level="4" style={styles.searchContainer}>
          <SearchBar
            input={searchInput}
            onChangeText={setSearchInput}
            onClearPress={onClearSearchPress}
          />
        </Layout>
        <ScrollView style={styles.scrollContainer}>
          <Layout level="4">
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
      </SafeAreaView>
    </Layout>
  );
};

const themedStyles = StyleSheet.create({
  instructionText: {
    paddingBottom: 10,
    textAlign: 'center',
  },
  fileName: {
    paddingBottom: 10,
    textAlign: 'center',
    color: 'color-primary-200',
  },
  safeArea: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  topContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
});

export default MeditationMatchScreen;

import React, {useContext, useState} from 'react';
import {Icon, Layout, Text, useStyleSheet} from '@ui-kitten/components';
import {Pressable, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {SearchBar} from '../components/SearchBar';
import {sortBy} from 'lodash';

import Button from '../components/Button';
import UnsupportedFilesContext from '../contexts/unsupportedFiles';
import {meditationBaseMap} from '../constants/meditation-data';
import {MeditationBase} from '../types';
import MeditationFilePathsContext from '../contexts/meditationFilePaths';

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

const iconStyles = StyleSheet.create({
  errorIcon: {
    height: 30,
    width: 30,
  },
});

interface MeditationOptionProps {
  name: string;
  selected: boolean;
  onPress(): void;
}

const MeditationOption = (props: MeditationOptionProps) => {
  const {name, onPress, selected} = props;
  return (
    <Pressable onPress={onPress}>
      <Layout
        level="4"
        style={
          selected
            ? MeditationOptionStyles.meditationSelected
            : MeditationOptionStyles.meditationDefault
        }>
        <Text category="h6" style={MeditationOptionStyles.text}>
          {name}
        </Text>
        {/* <Layout level="4" style={MeditationOptionStyles.statusContainer}>
          <Layout
            level="4"
            style={
              selected
                ? MeditationOptionStyles.statusSelected
                : MeditationOptionStyles.statusDefault
            }
          />
        </Layout> */}
      </Layout>
    </Pressable>
  );
};

const MeditationOptionStyles = StyleSheet.create({
  meditationDefault: {
    borderBottomColor: '#f3f3f3',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    opacity: 0.5,
  },
  meditationSelected: {
    borderBottomColor: '#f3f3f3',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    opacity: 1,
  },
  statusDefault: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 50,
    height: 25,
    width: 25,
  },
  statusSelected: {
    backgroundColor: 'green',
    borderWidth: 2,
    borderColor: 'green',
    borderRadius: 50,
    height: 25,
    width: 25,
  },
  statusContainer: {
    flex: 1,
    marginLeft: 20,
  },
  text: {
    flex: 9,
    fontSize: 16,
  },
});

const FixMeditationScreen = () => {
  const {unsupportedFiles} = useContext(UnsupportedFilesContext);
  const [unsupportedFileIndex, setUnsupportedFileIndex] = useState(0);
  const {meditationFilePaths} = useContext(MeditationFilePathsContext);
  const [searchInput, setSearchInput] = useState(EMPTY_SEARCH);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(1);
  const [selectedMeditationOption, setSelectedMeditationOption] = useState(
    EMPTY_SELECTED_OPTION,
  );

  const styles = useStyleSheet(themedStyles);

  const onSearchClearPress = () => setSearchInput(EMPTY_SEARCH);
  const onMeditationOptionPress = (meditationBase: MeditationBase) => {
    console.log('selectedMeditationOption', selectedMeditationOption);
    console.log(
      'meditationBase.meditationBaseId',
      meditationBase.meditationBaseId,
    );
    if (selectedMeditationOption === meditationBase.meditationBaseId) {
      setSelectedMeditationOption(EMPTY_SELECTED_OPTION);
    } else {
      setSelectedMeditationOption(meditationBase.meditationBaseId);
    }
  };

  const getMeditationOptions = () => {
    const meditationOptions = [];
    for (const key in meditationBaseMap) {
      const meditation = meditationBaseMap[key];
      if (meditation.name.includes(searchInput)) {
        meditationOptions.push(meditation);
      }
    }
    return sortBy(meditationOptions, 'name');
  };

  const meditationOptions = getMeditationOptions();
  const currentUnsupportedFileName =
    unsupportedFiles[unsupportedFileIndex]?.name;

  return (
    <Layout level="4" style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout level="4" style={styles.top}>
          <Layout level="4" style={styles.topContentContainer}>
            <ErrorIcon />
            <Text category="h6" style={styles.topText}>
              File not recognized ({currentErrorIndex}&nbsp;of&nbsp;
              {unsupportedFiles.length})
            </Text>
          </Layout>
        </Layout>
        <Layout level="4" style={styles.middle}>
          <Text category="h5">Which meditation is this?</Text>
          <Layout level="4" style={styles.unsupportedFileContainer}>
            <Text category="s1" style={styles.unsupportedFileName}>
              File: {currentUnsupportedFileName || ''}
            </Text>
          </Layout>
          {/* <Text category="h5">Which meditation is this?</Text> */}
          <SearchBar
            placeholder="Enter meditation name"
            input={searchInput}
            onChangeText={setSearchInput}
            onClearPress={onSearchClearPress}
            style={styles.searchBar}
          />
          <ScrollView>
            {searchInput
              ? meditationOptions.map(option => (
                  <MeditationOption
                    key={option.meditationBaseId}
                    name={option.name}
                    onPress={() => onMeditationOptionPress(option)}
                    selected={
                      selectedMeditationOption === option.meditationBaseId
                    }
                  />
                ))
              : null}
          </ScrollView>
        </Layout>
        <Layout level="4" style={styles.bottom}>
          <Button size="large" style={styles.nextButton}>
            Next
          </Button>
          <Button appearance="ghost" size="large" status="basic">
            Skip
          </Button>
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};

const themedStyles = StyleSheet.create({
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
  nextButton: {
    color: 'white',
    marginBottom: 16,
  },
  searchBar: {
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

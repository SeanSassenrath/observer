import React, {useContext, useState} from 'react';
import {Button, Layout, Text} from '@ui-kitten/components';
import {Pressable, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {SearchBar} from '../components/SearchBar';
import {sortBy} from 'lodash';

import UnsupportedFilesContext from '../contexts/unsupportedFiles';
import {meditationBaseMap} from '../constants/meditation-data';
import {MeditationBase} from '../types';

const EMPTY_SEARCH = '';
const EMPTY_SELECTED_OPTION = '';

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
        style={
          selected
            ? MeditationOptionStyles.meditationSelected
            : MeditationOptionStyles.meditationDefault
        }>
        <Text category="h6" style={MeditationOptionStyles.text}>
          {name}
        </Text>
        <Layout style={MeditationOptionStyles.statusContainer}>
          <Layout
            style={
              selected
                ? MeditationOptionStyles.statusSelected
                : MeditationOptionStyles.statusDefault
            }
          />
        </Layout>
      </Layout>
    </Pressable>
  );
};

const MeditationOptionStyles = StyleSheet.create({
  meditationDefault: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    opacity: 0.5,
  },
  meditationSelected: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    opacity: 1,
  },
  statusDefault: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 50,
    height: 30,
    width: 30,
  },
  statusSelected: {
    backgroundColor: 'green',
    borderWidth: 2,
    borderColor: 'green',
    borderRadius: 50,
    height: 30,
    width: 30,
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {unsupportedFiles} = useContext(UnsupportedFilesContext);
  const [unsupportedFileIndex, setUnsupportedFileIndex] = useState(0);
  const [searchInput, setSearchInput] = useState(EMPTY_SEARCH);
  const [selectedMeditationOption, setSelectedMeditationOption] = useState(
    EMPTY_SELECTED_OPTION,
  );

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
    <Layout style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.top}>
          <Text category="h5">Which meditation is this?</Text>
          <Layout level="4" style={styles.unsupportedFileContainer}>
            <Text category="s1">{currentUnsupportedFileName || ''}</Text>
          </Layout>
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
        <Layout style={styles.bottom}>
          <Button size="large">Update</Button>
          <Button appearance="ghost" size="large" status="basic">
            Skip
          </Button>
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  bottom: {
    flex: 1,
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
  },
  top: {
    flex: 7,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  searchBar: {
    marginVertical: 16,
  },
  unsupportedFileContainer: {
    borderRadius: 8,
    marginBottom: 40,
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});

export default FixMeditationScreen;

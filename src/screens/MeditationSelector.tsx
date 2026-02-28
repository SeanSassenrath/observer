import React, {useContext, useState, useMemo} from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Layout, Text, Icon} from '@ui-kitten/components';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {SearchBar} from '../components/SearchBar';

import MeditationBaseDataContext from '../contexts/meditationBaseData';
import {MeditationId, MeditationBase, StackParamList} from '../types';
import {brightWhite} from '../constants/colors';

const COLOR_PRIMARY = '#9C4DCC';

type MeditationSelectorRouteProp = RouteProp<
  StackParamList,
  'MeditationSelector'
>;

const MeditationSelectorScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<MeditationSelectorRouteProp>();
  const {initialSelectedIds, returnScreen} = route.params;

  const {meditationBaseData} = useContext(MeditationBaseDataContext);
  const [selectedIds, setSelectedIds] = useState<Set<MeditationId>>(
    new Set(initialSelectedIds),
  );
  const [searchQuery, setSearchQuery] = useState('');

  const meditationsArray: MeditationBase[] = useMemo(() => {
    const meditations = Object.values(meditationBaseData);
    return meditations.sort((a, b) => {
      if (a.groupName < b.groupName) return -1;
      if (a.groupName > b.groupName) return 1;
      const aName = a.name || '';
      const bName = b.name || '';
      return aName.localeCompare(bName);
    });
  }, [meditationBaseData]);

  const filteredMeditations = useMemo(() => {
    if (!searchQuery.trim()) {
      return meditationsArray;
    }
    const query = searchQuery.toLowerCase();
    return meditationsArray.filter(
      med =>
        med.name?.toLowerCase().includes(query) ||
        med.groupName?.toString().toLowerCase().includes(query),
    );
  }, [meditationsArray, searchQuery]);

  const toggleMeditation = (meditationId: MeditationId) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(meditationId)) {
      newSelectedIds.delete(meditationId);
    } else {
      newSelectedIds.add(meditationId);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleDone = () => {
    navigation.navigate({
      name: returnScreen as any,
      params: {returnedMeditationIds: Array.from(selectedIds)},
      merge: true,
    });
  };

  const selectedArray = useMemo(() => Array.from(selectedIds), [selectedIds]);
  const isDoneEnabled = selectedIds.size > 0;

  const renderPill = (meditationId: MeditationId) => {
    const meditation = meditationBaseData[meditationId];
    if (!meditation) return null;
    const name =
      meditation.name.length > 25
        ? meditation.name.substring(0, 25) + '...'
        : meditation.name;
    return (
      <View key={meditationId} style={styles.pill}>
        <Text category="c1" style={styles.pillText}>
          {name}
        </Text>
        <TouchableOpacity
          onPress={() => toggleMeditation(meditationId)}
          hitSlop={{top: 8, bottom: 8, left: 4, right: 8}}>
          <Icon
            name="close-outline"
            fill={COLOR_PRIMARY}
            style={styles.pillCloseIcon}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderMeditationItem = ({item}: {item: MeditationBase}) => {
    const isSelected = selectedIds.has(item.meditationBaseId);

    return (
      <TouchableOpacity
        style={isSelected ? styles.itemSelected : styles.item}
        onPress={() => toggleMeditation(item.meditationBaseId)}>
        <View style={styles.itemContent}>
          <View style={styles.itemInfo}>
            <Text category="p1" style={styles.itemName}>
              {item.name}
            </Text>
            <View style={styles.itemMeta}>
              {item.groupName && (
                <Text category="c1" style={styles.itemGroup}>
                  {item.groupName}
                </Text>
              )}
              <Text category="c1" style={styles.itemDuration}>
                {item.formattedDuration}
              </Text>
            </View>
          </View>
          <View
            style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
            {isSelected && (
              <Icon
                name="checkmark-outline"
                fill={brightWhite}
                style={styles.checkIcon}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Layout style={styles.layout} level="4">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Icon
              name="arrow-back-outline"
              fill={brightWhite}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          <Text category="h6" style={styles.headerTitle}>
            Select Meditations
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            input={searchQuery}
            placeholder="Search meditations..."
            onChangeText={setSearchQuery}
            onClearPress={() => setSearchQuery('')}
          />
        </View>

        {/* Selected Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.pillsContainer}
          contentContainerStyle={styles.pillsContent}>
          {selectedArray.map(renderPill)}
        </ScrollView>

        {/* Meditations List */}
        <FlatList
          data={filteredMeditations}
          renderItem={renderMeditationItem}
          keyExtractor={(item, index) =>
            item.meditationBaseId || `meditation-${index}`
          }
          contentContainerStyle={styles.listContainer}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text category="p2" style={styles.emptyText}>
                {searchQuery.trim()
                  ? 'No meditations found'
                  : 'No meditations available'}
              </Text>
            </View>
          }
        />

        {/* Fixed Bottom CTA */}
        <View style={styles.bottomButtonContainer}>
          {/* Selection Count */}
          <View style={styles.selectionCount}>
            <Text
              category="s1"
              style={[
                styles.selectionText,
                selectedIds.size === 0 && {opacity: 0},
              ]}>
              {selectedIds.size}{' '}
              {selectedIds.size === 1 ? 'Meditation' : 'Meditations'} Selected
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleDone}
            disabled={!isDoneEnabled}
            style={[
              styles.doneButton,
              !isDoneEnabled && styles.doneButtonDisabled,
            ]}>
            <Text category="h6" style={styles.doneButtonText}>
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    paddingRight: 8,
  },
  headerIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    color: brightWhite,
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 16,
  },
  pillsContainer: {
    maxHeight: 60,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  pillsContent: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(156, 77, 204, 0.15)',
    borderWidth: 1,
    borderColor: COLOR_PRIMARY,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillText: {
    color: COLOR_PRIMARY,
    marginRight: 6,
  },
  pillCloseIcon: {
    width: 14,
    height: 14,
  },
  selectionCount: {
    paddingBottom: 8,
  },
  selectionText: {
    color: COLOR_PRIMARY,
    textAlign: 'center',
    opacity: 0.75,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  item: {
    backgroundColor: 'transparent',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    borderBottomColor: 'rgba(156, 77, 204, 0.2)',
    overflow: 'hidden',
  },
  itemSelected: {
    backgroundColor: 'rgba(156, 77, 204, 0.15)',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLOR_PRIMARY,
    borderBottomColor: COLOR_PRIMARY,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    color: brightWhite,
    marginBottom: 4,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemGroup: {
    color: '#9CA3AF',
  },
  itemDuration: {
    color: '#6B7280',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6B7280',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLOR_PRIMARY,
    borderColor: COLOR_PRIMARY,
  },
  checkIcon: {
    width: 16,
    height: 16,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9CA3AF',
  },
  bottomButtonContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  doneButton: {
    backgroundColor: COLOR_PRIMARY,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonDisabled: {
    backgroundColor: '#4B5563',
    opacity: 0.5,
  },
  doneButtonText: {
    color: brightWhite,
    fontWeight: '600',
  },
});

export default MeditationSelectorScreen;

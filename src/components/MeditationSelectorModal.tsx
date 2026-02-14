import React, {useContext, useState, useMemo} from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text, Icon, Input} from '@ui-kitten/components';

import MeditationBaseDataContext from '../contexts/meditationBaseData';
import {MeditationId, MeditationBase} from '../types';
import {brightWhite} from '../constants/colors';

const COLOR_PRIMARY = '#9C4DCC';

interface MeditationSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (meditationIds: MeditationId[]) => void;
  initialSelectedIds?: MeditationId[];
}

const MeditationSelectorModal: React.FC<MeditationSelectorModalProps> = ({
  visible,
  onClose,
  onSelect,
  initialSelectedIds = [],
}) => {
  const {meditationBaseData} = useContext(MeditationBaseDataContext);
  const [selectedIds, setSelectedIds] = useState<Set<MeditationId>>(
    new Set(initialSelectedIds),
  );
  const [searchQuery, setSearchQuery] = useState('');

  const meditationsArray: MeditationBase[] = useMemo(() => {
    const meditations = Object.values(meditationBaseData);
    console.log('MeditationSelectorModal - Available meditations:', meditations.length);
    console.log('MeditationSelectorModal - meditationBaseData keys:', Object.keys(meditationBaseData));

    return meditations.sort((a, b) => {
      if (a.groupName < b.groupName) return -1;
      if (a.groupName > b.groupName) return 1;
      // Handle undefined names gracefully
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
    onSelect(Array.from(selectedIds));
  };

  const handleCancel = () => {
    setSelectedIds(new Set(initialSelectedIds));
    setSearchQuery('');
    onClose();
  };

  const renderMeditationItem = ({item}: {item: MeditationBase}) => {
    const isSelected = selectedIds.has(item.meditationBaseId);

    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.itemSelected]}
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
            style={[
              styles.checkbox,
              isSelected && styles.checkboxSelected,
            ]}>
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
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}>
      <SafeAreaView style={styles.container}>
        <View style={styles.layout}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleCancel}
              style={styles.headerButton}>
              <Text category="s1" style={styles.cancelText}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text category="h6" style={styles.headerTitle}>
              Select Meditations
            </Text>
            <TouchableOpacity
              onPress={handleDone}
              style={styles.headerButton}>
              <Text category="s1" style={styles.doneText}>
                Done
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Input
              placeholder="Search meditations..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              accessoryLeft={props => (
                <Icon {...props} name="search-outline" />
              )}
              style={styles.searchInput}
            />
          </View>

          {/* Selection Count */}
          {selectedIds.size > 0 && (
            <View style={styles.selectionCount}>
              <Text category="c1" style={styles.selectionText}>
                {selectedIds.size} {selectedIds.size === 1 ? 'meditation' : 'meditations'} selected
              </Text>
            </View>
          )}

          {/* Meditations List */}
          <FlatList
            data={filteredMeditations}
            renderItem={renderMeditationItem}
            keyExtractor={(item, index) => item.meditationBaseId || `meditation-${index}`}
            contentContainerStyle={styles.listContainer}
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
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  layout: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerButton: {
    padding: 8,
    minWidth: 60,
  },
  headerTitle: {
    color: brightWhite,
  },
  cancelText: {
    color: '#9CA3AF',
  },
  doneText: {
    color: COLOR_PRIMARY,
    textAlign: 'right',
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectionCount: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  selectionText: {
    color: COLOR_PRIMARY,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  item: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  itemSelected: {
    backgroundColor: 'rgba(156, 77, 204, 0.15)',
    borderWidth: 1,
    borderColor: COLOR_PRIMARY,
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
});

export default MeditationSelectorModal;

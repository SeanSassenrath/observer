import React, {useContext, useState, useMemo} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
} from 'react-native';
import {Layout, Text, Icon} from '@ui-kitten/components';
import {useNavigation, useRoute} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import MeditationFilePathsContext from '../contexts/meditationFilePaths';
import MeditationBaseDataContext from '../contexts/meditationBaseData';
import {brightWhite} from '../constants/colors';
import {meditationBaseMap} from '../constants/meditation-data';
import {setMeditationFilePathDataInAsyncStorage} from '../utils/asyncStorageMeditation';

interface ReassignFileParams {
  meditationId: string;
  filePath: string;
  fileName: string;
}

const BackIcon = (props: any) => (
  <Icon
    {...props}
    style={iconStyles.backIcon}
    fill={brightWhite}
    name="arrow-back-outline"
  />
);

const ReassignFileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {meditationId, filePath, fileName} = route.params as ReassignFileParams;

  const [selectedMeditationId, setSelectedMeditationId] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);

  const {meditationFilePaths, setMeditationFilePaths} = useContext(
    MeditationFilePathsContext,
  );
  const {meditationBaseData} = useContext(MeditationBaseDataContext);

  // Get current meditation name (try context first, then fallback to full map)
  const currentMeditation =
    meditationBaseData[meditationId] || meditationBaseMap[meditationId];

  // Get all available meditations from the complete meditation base map
  const allMeditations = Object.entries(meditationBaseMap).map(
    ([id, meditation]) => ({
      id,
      name: meditation.name,
    }),
  );

  // Filter meditations based on search query
  const availableMeditations = useMemo(() => {
    if (!searchQuery.trim()) {
      return allMeditations;
    }
    return allMeditations.filter(meditation =>
      meditation.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [allMeditations, searchQuery]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleMeditationSelect = (newMeditationId: string) => {
    // If the same meditation is selected again, deselect it
    if (selectedMeditationId === newMeditationId) {
      setSelectedMeditationId(null);
    } else {
      setSelectedMeditationId(newMeditationId);
    }
  };

  const handleReassign = () => {
    if (!selectedMeditationId) {
      return;
    }

    // Get the selected meditation name for the toast
    const selectedMeditation = meditationBaseMap[selectedMeditationId];

    // Update the meditation file paths
    const updatedPaths = {...meditationFilePaths};
    delete updatedPaths[meditationId]; // Remove old assignment
    updatedPaths[selectedMeditationId] = filePath; // Add new assignment

    setMeditationFilePaths(updatedPaths);

    // Show success toast
    Toast.show({
      type: 'success',
      text1: 'File Reassigned Successfully',
      text2: `${fileName} is now assigned to ${
        selectedMeditation?.name || 'Unknown Meditation'
      }`,
      visibilityTime: 3000,
      position: 'bottom',
    });

    navigation.goBack();
  };

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    // Remove the file assignment from context
    const updatedPaths = {...meditationFilePaths};
    delete updatedPaths[meditationId];
    
    setMeditationFilePaths(updatedPaths);
    
    // Remove from async storage
    await setMeditationFilePathDataInAsyncStorage(updatedPaths);

    setShowDeleteConfirmation(false);

    // Show delete confirmation toast
    Toast.show({
      type: 'success',
      text1: 'File Removed from Library',
      text2: `${fileName} has been removed from your meditation library`,
      visibilityTime: 3000,
      position: 'bottom',
    });

    navigation.goBack();
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <Layout level="4" style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.topBar}>
          <Pressable onPress={handleBack}>
            <BackIcon />
          </Pressable>
          <Text style={styles.title}>Reassign File</Text>
          <Pressable onPress={handleDelete}>
            <Icon
              name="trash-2-outline"
              style={iconStyles.deleteIcon}
              fill={brightWhite}
            />
          </Pressable>
        </View>

        <ScrollView style={styles.content}>
          {/* File Info Card */}
          <View style={styles.fileInfoCard}>
            <Text style={styles.sectionLabel}>File</Text>
            <Text style={styles.fileName}>{fileName}</Text>

            <Text style={styles.sectionLabel}>Currently assigned to</Text>
            <Text style={styles.currentMeditation}>
              {currentMeditation?.name || 'Unknown Meditation'}
            </Text>
          </View>

          {/* Reassign Section */}
          <View style={styles.reassignSection}>
            <Text style={styles.reassignLabel}>
              Reassign to meditation
              {searchQuery.trim() &&
                ` (${availableMeditations.length} results)`}
            </Text>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Icon
                name="search-outline"
                style={styles.searchIcon}
                fill="#9CA3AF"
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search meditations..."
                placeholderTextColor="#6B7280"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  style={styles.clearButton}>
                  <Icon
                    name="close-outline"
                    style={styles.clearIcon}
                    fill="#6B7280"
                  />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.meditationList}>
              {availableMeditations.map(meditation => (
                <TouchableOpacity
                  key={meditation.id}
                  style={[
                    styles.meditationItem,
                    selectedMeditationId === meditation.id &&
                      styles.selectedMeditationItem,
                  ]}
                  onPress={() => handleMeditationSelect(meditation.id)}>
                  <Text
                    style={[
                      styles.meditationName,
                      selectedMeditationId === meditation.id &&
                        styles.selectedMeditationName,
                    ]}>
                    {meditation.name}
                  </Text>
                  {selectedMeditationId === meditation.id && (
                    <Icon
                      name="checkmark"
                      style={styles.checkIcon}
                      fill="#9C4DCC"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Absolutely Positioned Reassign Button */}
        <View style={styles.absoluteBottomAction}>
          <TouchableOpacity
            style={[
              styles.reassignButton,
              !selectedMeditationId && styles.reassignButtonDisabled,
            ]}
            onPress={selectedMeditationId ? handleReassign : undefined}
            disabled={!selectedMeditationId}>
            <Text
              style={[
                styles.reassignButtonText,
                !selectedMeditationId && styles.reassignButtonTextDisabled,
              ]}>
              Reassign
            </Text>
          </TouchableOpacity>
        </View>

        {/* Delete Confirmation Modal */}
        <Modal
          visible={showDeleteConfirmation}
          transparent={true}
          animationType="fade"
          onRequestClose={cancelDelete}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Remove File from Library</Text>
              
              <Text style={styles.modalMessage}>
                Are you sure you want to remove "{fileName}" from your meditation library? This action cannot be undone.
              </Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalCancelButton} onPress={cancelDelete}>
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalDeleteButton} onPress={confirmDelete}>
                  <Text style={styles.modalDeleteButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40, // Same width as back icon for centering
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 100, // Add space for absolute button
  },
  fileInfoCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  fileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  currentMeditation: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9C4DCC',
  },
  reassignSection: {
    flex: 1,
  },
  reassignLabel: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 16,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: '#FFFFFF',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearIcon: {
    width: 16,
    height: 16,
  },
  meditationList: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    overflow: 'hidden',
  },
  meditationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  selectedMeditationItem: {
    backgroundColor: '#374151',
  },
  meditationName: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  selectedMeditationName: {
    fontWeight: '600',
    color: '#9C4DCC',
  },
  checkIcon: {
    width: 20,
    height: 20,
  },
  absoluteBottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#111827', // Match Layout level="4" background
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34, // Account for safe area
  },
  reassignButton: {
    backgroundColor: '#9C4DCC',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
  },
  reassignButtonDisabled: {
    backgroundColor: '#4B5563',
  },
  reassignButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  reassignButtonTextDisabled: {
    color: '#9CA3AF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1F2937',
    margin: 20,
    borderRadius: 16,
    padding: 24,
    minWidth: 320,
    maxWidth: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#374151',
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  modalDeleteButton: {
    flex: 1,
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: 'center',
  },
  modalDeleteButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

const iconStyles = StyleSheet.create({
  backIcon: {
    height: 40,
    width: 40,
  },
  deleteIcon: {
    height: 30,
    width: 30,
  },
});

export default ReassignFileScreen;

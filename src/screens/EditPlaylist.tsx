import React, {useContext, useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {Layout, Text, Icon, Input, Button} from '@ui-kitten/components';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';

import PlaylistContext from '../contexts/playlist';
import MeditationBaseDataContext from '../contexts/meditationBaseData';
import UserContext from '../contexts/userData';
import {MeditationId, StackParamList} from '../types';
import {brightWhite} from '../constants/colors';
import {fbUpdatePlaylist, fbDeletePlaylist} from '../fb/playlists';
import {setPlaylistsInAsyncStorage} from '../utils/asyncStoragePlaylists';
import MeditationSelectorModal from '../components/MeditationSelectorModal';

const COLOR_PRIMARY = '#9C4DCC';

type EditPlaylistRouteProp = RouteProp<StackParamList, 'EditPlaylist'>;

const EditPlaylist = () => {
  const navigation = useNavigation();
  const route = useRoute<EditPlaylistRouteProp>();
  const {playlistId} = route.params;

  const {user} = useContext(UserContext);
  const {playlists, setPlaylists} = useContext(PlaylistContext);
  const {meditationBaseData} = useContext(MeditationBaseDataContext);

  const playlist = playlists[playlistId];

  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedMeditationIds, setSelectedMeditationIds] = useState<
    MeditationId[]
  >([]);
  const [isSelectorModalVisible, setIsSelectorModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (playlist) {
      setPlaylistName(playlist.name);
      setDescription(playlist.description || '');
      setNotes(playlist.notes || '');
      setSelectedMeditationIds(playlist.meditationIds);
    }
  }, [playlist]);

  const isValid = playlistName.trim().length > 0 && selectedMeditationIds.length > 0;

  const calculateTotalDuration = (): number => {
    let totalMinutes = 0;
    selectedMeditationIds.forEach(medId => {
      const meditation = meditationBaseData[medId];
      if (meditation && meditation.formattedDuration) {
        const duration = meditation.formattedDuration;

        // Try to match formatted duration (e.g., "45 min" or "1 hr 15 min")
        const minutesMatch = duration.match(/(\d+)\s*min/);
        const hoursMatch = duration.match(/(\d+)\s*hr/);

        if (minutesMatch || hoursMatch) {
          if (minutesMatch) {
            totalMinutes += parseInt(minutesMatch[1], 10);
          }
          if (hoursMatch) {
            totalMinutes += parseInt(hoursMatch[1], 10) * 60;
          }
        } else {
          // Handle plain number format (e.g., "45")
          const plainNumber = parseInt(duration, 10);
          if (!isNaN(plainNumber)) {
            totalMinutes += plainNumber;
          }
        }
      }
    });
    return totalMinutes;
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
  };

  const handleSave = async () => {
    if (!isValid || isSaving) {
      return;
    }

    try {
      setIsSaving(true);

      const updates = {
        name: playlistName.trim(),
        description: description.trim(),
        notes: notes.trim(),
        meditationIds: selectedMeditationIds,
        totalDuration: calculateTotalDuration(),
      };

      await fbUpdatePlaylist(user.uid, playlistId, updates);

      const updatedPlaylists = {
        ...playlists,
        [playlistId]: {
          ...playlist,
          ...updates,
          updatedAt: Date.now(),
        },
      };

      setPlaylists(updatedPlaylists);
      await setPlaylistsInAsyncStorage(updatedPlaylists);

      navigation.goBack();
    } catch (error) {
      console.error('Error updating playlist:', error);
      Alert.alert('Error', 'Failed to update playlist. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Playlist',
      `Are you sure you want to delete "${playlist.name}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              await fbDeletePlaylist(user.uid, playlistId);

              const updatedPlaylists = {...playlists};
              delete updatedPlaylists[playlistId];

              setPlaylists(updatedPlaylists);
              await setPlaylistsInAsyncStorage(updatedPlaylists);

              navigation.goBack();
            } catch (error) {
              console.error('Error deleting playlist:', error);
              Alert.alert('Error', 'Failed to delete playlist. Please try again.');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  };

  const handleAddMeditations = (meditationIds: MeditationId[]) => {
    setSelectedMeditationIds(meditationIds);
    setIsSelectorModalVisible(false);
  };

  const handleRemoveMeditation = (meditationId: MeditationId) => {
    setSelectedMeditationIds(
      selectedMeditationIds.filter(id => id !== meditationId),
    );
  };

  const handleDragEnd = ({data}: {data: MeditationId[]}) => {
    setSelectedMeditationIds(data);
  };

  const renderMeditationItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<MeditationId>) => {
    const meditation = meditationBaseData[item];
    if (!meditation) {
      return null;
    }

    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={[
            styles.meditationItem,
            isActive && styles.meditationItemActive,
          ]}>
          <View style={styles.dragHandle}>
            <Icon name="menu-outline" fill="#6B7280" style={styles.dragIcon} />
          </View>
          <View style={styles.meditationInfo}>
            <Text category="p1" style={styles.meditationName}>
              {meditation.name}
            </Text>
            <Text category="c1" style={styles.meditationDuration}>
              {meditation.formattedDuration}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleRemoveMeditation(item)}
            style={styles.removeButton}>
            <Icon
              name="close-outline"
              fill="#EF4444"
              style={styles.removeIcon}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyMeditations}>
      <Icon name="music-outline" fill="#6B7280" style={styles.emptyIcon} />
      <Text category="p2" style={styles.emptyText}>
        No meditations added yet
      </Text>
      <Text category="c1" style={styles.emptySubtext}>
        Tap the button above to add meditations
      </Text>
    </View>
  );

  if (!playlist) {
    return (
      <SafeAreaView style={styles.container}>
        <Layout style={styles.layout}>
          <View style={styles.errorContainer}>
            <Text category="h6" style={styles.errorText}>
              Playlist not found
            </Text>
          </View>
        </Layout>
      </SafeAreaView>
    );
  }

  const totalDuration = calculateTotalDuration();

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
            Edit Playlist
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <KeyboardAwareScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}>
          {/* Playlist Name Input */}
          <Layout level="2" style={styles.playlistNameSection}>
            <Text category="s1" style={styles.label}>
              Playlist Name
            </Text>
            <Input
              placeholder="e.g., Morning Routine"
              value={playlistName}
              onChangeText={setPlaylistName}
              style={styles.input}
              textStyle={styles.textStyle}
            />
          </Layout>

          {/* Meditations Section */}
          <View style={styles.section}>
            <View style={styles.meditationsHeader}>
              <View>
                <Text category="h6" style={styles.label}>
                  Meditations
                </Text>
                <Text category="s2" style={styles.meditationsMeta}>
                  {selectedMeditationIds.length} {selectedMeditationIds.length === 1 ? 'track' : 'tracks'} • {formatDuration(totalDuration)}
                </Text>
              </View>
              <Button
                size="medium"
                onPress={() => setIsSelectorModalVisible(true)}
                appearance="outline">
                {selectedMeditationIds.length > 0 ? 'Manage' : 'Add Meditations'}
              </Button>
            </View>

            {selectedMeditationIds.length > 0 ? (
              <View style={styles.meditationsList}>
                <Text category="c1" style={styles.dragHint}>
                  Long press and drag to reorder
                </Text>
                <DraggableFlatList
                  data={selectedMeditationIds}
                  renderItem={renderMeditationItem}
                  keyExtractor={item => item}
                  onDragEnd={handleDragEnd}
                  containerStyle={styles.draggableContainer}
                  scrollEnabled={false}
                />
              </View>
            ) : (
              renderEmptyState()
            )}
          </View>

          {/* Delete Button */}
          <View style={styles.section}>
            <Button
              status="danger"
              appearance="outline"
              onPress={handleDelete}
              disabled={isDeleting}
              accessoryLeft={props => (
                <Icon {...props} name="trash-outline" />
              )}>
              {isDeleting ? 'Deleting...' : 'Delete Playlist'}
            </Button>
          </View>
        </KeyboardAwareScrollView>

        {/* Fixed Save Button at Bottom */}
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            onPress={handleSave}
            disabled={!isValid || isSaving}
            style={[
              styles.saveButton,
              (!isValid || isSaving) && styles.saveButtonDisabled,
            ]}>
            <Text category="h6" style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      
      {/* Meditation Selector Modal */}
      <MeditationSelectorModal
        visible={isSelectorModalVisible}
        onClose={() => setIsSelectorModalVisible(false)}
        onSelect={handleAddMeditations}
        initialSelectedIds={selectedMeditationIds}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  bottomButtonContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  saveButton: {
    backgroundColor: COLOR_PRIMARY,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#4B5563',
    opacity: 0.5,
  },
  saveButtonText: {
    color: brightWhite,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    color: '#9CA3AF',
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'rgba(48,55,75,0.6)',
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 10,
    height: 60,
  },
  meditationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  meditationsMeta: {
    color: '#6B7280',
  },
  meditationsList: {
    marginTop: 8,
  },
  dragHint: {
    color: '#6B7280',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  draggableContainer: {
    minHeight: 100,
  },
  meditationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  meditationItemActive: {
    backgroundColor: 'rgba(156, 77, 204, 0.2)',
  },
  dragHandle: {
    marginRight: 12,
  },
  dragIcon: {
    width: 20,
    height: 20,
  },
  meditationInfo: {
    flex: 1,
  },
  meditationName: {
    color: brightWhite,
    marginBottom: 2,
  },
  meditationDuration: {
    color: '#9CA3AF',
  },
  removeButton: {
    padding: 4,
  },
  removeIcon: {
    width: 20,
    height: 20,
  },
  emptyMeditations: {
    alignItems: 'center',
    paddingVertical: 48,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#6B7280',
    borderRadius: 12,
    marginHorizontal: 8,
    marginTop: 20,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    marginBottom: 12,
  },
  emptyText: {
    color: '#9CA3AF',
    marginBottom: 4,
  },
  emptySubtext: {
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: brightWhite,
  },
  textStyle: {
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  playlistNameSection: {
    marginBottom: 24,
    padding: 10,
    borderRadius: 10,
  },
});

export default EditPlaylist;

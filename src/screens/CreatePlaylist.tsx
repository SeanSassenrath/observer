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
import {MeditationId, Playlist, StackParamList} from '../types';
import {brightWhite} from '../constants/colors';
import {fbCreatePlaylist} from '../fb/playlists';
import {setPlaylistsInAsyncStorage} from '../utils/asyncStoragePlaylists';
import {GradientPicker} from '../components/GradientPicker';

type CreatePlaylistRouteProp = RouteProp<StackParamList, 'CreatePlaylist'>;

const CreatePlaylist = () => {
  const navigation = useNavigation();
  const route = useRoute<CreatePlaylistRouteProp>();
  const {user} = useContext(UserContext);
  const {playlists, setPlaylists} = useContext(PlaylistContext);
  const {meditationBaseData} = useContext(MeditationBaseDataContext);

  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedMeditationIds, setSelectedMeditationIds] = useState<
    MeditationId[]
  >([]);
  const [selectedGradientIndex, setSelectedGradientIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (route.params?.returnedMeditationIds) {
      setSelectedMeditationIds(route.params.returnedMeditationIds);
      navigation.setParams({returnedMeditationIds: undefined} as any);
    }
  }, [route.params?.returnedMeditationIds]);

  const isValid =
    playlistName.trim().length > 0 && selectedMeditationIds.length > 0;

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

      const newPlaylist: Omit<
        Playlist,
        'playlistId' | 'createdAt' | 'updatedAt'
      > = {
        name: playlistName.trim(),
        description: description.trim(),
        notes: notes.trim(),
        meditationIds: selectedMeditationIds,
        totalDuration: calculateTotalDuration(),
        gradientIndex: selectedGradientIndex,
      };

      const playlistId = await fbCreatePlaylist(user.uid, newPlaylist);

      const updatedPlaylists = {
        ...playlists,
        [playlistId]: {
          ...newPlaylist,
          playlistId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          lastInteractedAt: Date.now(),
        },
      };

      setPlaylists(updatedPlaylists);
      await setPlaylistsInAsyncStorage(updatedPlaylists);

      navigation.goBack();
    } catch (error) {
      console.error('Error creating playlist:', error);
      Alert.alert('Error', 'Failed to create playlist. Please try again.');
    } finally {
      setIsSaving(false);
    }
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
    getIndex,
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
          <Text category="c1" style={styles.orderNumber}>
            {(getIndex() ?? 0) + 1}
          </Text>
          <View style={styles.meditationInfo}>
            <Text category="p1" style={styles.meditationName}>
              {meditation.name}
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
      <Icon name="list-outline" fill="#4B5563" style={styles.emptyIcon} />
      <Text category="s1" style={styles.emptyText}>
        No meditations yet
      </Text>
      <Text category="p2" style={styles.emptySubtext}>
        Tap the button above to start{'\n'}building your journey.
      </Text>
    </View>
  );

  const totalDuration = calculateTotalDuration();

  return (
    <Layout style={styles.layout} level="4">
      <SafeAreaView style={styles.container}>
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
            New Playlist
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <KeyboardAwareScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}>
          {/* Playlist Name */}
          <View style={styles.playlistNameSection}>
            <Text category="s1" style={styles.label}>
              Name Your Playlist
            </Text>
            <Input
              placeholder="e.g., Morning Routine"
              value={playlistName}
              onChangeText={setPlaylistName}
              style={styles.input}
              textStyle={styles.textStyle}
            />
          </View>

          {/* Gradient Theme Picker */}
          <View style={styles.gradientPickerSection}>
            <Text category="s1" style={styles.playlistColorLabel}>
              Choose a Color
            </Text>
            <GradientPicker
              selectedIndex={selectedGradientIndex}
              onSelect={setSelectedGradientIndex}
            />
          </View>

          {/* Meditations */}
          <View style={styles.section}>
            <View style={styles.meditationsHeader}>
              <View>
                <Text category="h6" style={styles.sectionTitle}>
                  Meditations
                </Text>
                <Text category="s2" style={styles.meditationsMeta}>
                  {selectedMeditationIds.length}{' '}
                  {selectedMeditationIds.length === 1 ? 'track' : 'tracks'}{' '}
                  {'\u00B7'} {formatDuration(totalDuration)}
                </Text>
              </View>
              <Button
                size="medium"
                onPress={() =>
                  navigation.navigate('MeditationSelector', {
                    initialSelectedIds: selectedMeditationIds,
                    returnScreen: 'CreatePlaylist',
                  })
                }
                appearance="outline"
                style={{borderColor: '#9C4DCC', borderRadius: 10}}
                accessoryLeft={
                  selectedMeditationIds.length === 0
                    ? props => (
                        <Icon {...props} name="plus-outline" fill="#9C4DCC" />
                      )
                    : undefined
                }>
                {evaProps => (
                  <Text
                    {...evaProps}
                    style={[evaProps?.style, {color: '#9C4DCC'}]}>
                    {selectedMeditationIds.length > 0 ? 'Edit' : 'Add'}
                  </Text>
                )}
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
                  keyExtractor={(item, index) => item || `meditation-${index}`}
                  onDragEnd={handleDragEnd}
                  containerStyle={styles.draggableContainer}
                  scrollEnabled={false}
                />
              </View>
            ) : (
              renderEmptyState()
            )}
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
              {isSaving ? 'Saving...' : 'Save Playlist'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

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
  gradientPickerSection: {
    marginBottom: 40,
    marginHorizontal: -16,
  },
  playlistNameSection: {
    marginBottom: 40,
  },
  label: {
    color: '#9CA3AF',
    marginBottom: 6,
  },
  playlistColorLabel: {
    color: '#9CA3AF',
    marginBottom: 6,
    paddingLeft: 15,
  },
  sectionTitle: {
    color: brightWhite,
    marginBottom: 4,
  },
  input: {
    backgroundColor: 'rgba(48,55,75,0.6)',
    borderRadius: 10,
    marginTop: 10,
    height: 60,
  },
  textStyle: {
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomButtonContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  saveButton: {
    backgroundColor: '#9C4DCC',
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
  orderNumber: {
    color: '#9CA3AF',
    width: 24,
    textAlign: 'center',
    marginRight: 8,
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
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    marginTop: 12,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    marginBottom: 12,
  },
  emptyText: {
    color: brightWhite,
    marginBottom: 4,
  },
  emptySubtext: {
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default CreatePlaylist;

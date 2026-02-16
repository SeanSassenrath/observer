import React, {useContext, useRef, useState, useEffect} from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Icon, Layout, Text, useStyleSheet} from '@ui-kitten/components';
import LinearGradient from 'react-native-linear-gradient';

import _Button from '../components/Button';
import {StackParamList} from '../types';
import {MultiLineInput} from '../components/MultiLineInput';
import MeditationInstanceDataContext from '../contexts/meditationInstanceData';
import MeditationSessionContext from '../contexts/meditationSession';
import PlaylistContext from '../contexts/playlist';
import MeditationBaseDataContext from '../contexts/meditationBaseData';
import MeditationFilePathsContext from '../contexts/meditationFilePaths';
import UserContext from '../contexts/userData';
import {brightWhite} from '../constants/colors';
import {getFullMeditationCatalogSync} from '../services/meditationCatalog';
import {fbUpdatePlaylist} from '../fb/playlists';
import {setPlaylistsInAsyncStorage} from '../utils/asyncStoragePlaylists';

const EMPTY_STRING = '';
const oneSecond = 1000;

const BackIcon = (props: any) => (
  <Icon
    {...props}
    style={themedStyles.backIcon}
    fill={brightWhite}
    name="arrow-back-outline"
  />
);

const EditIcon = (props: any) => (
  <Icon
    {...props}
    style={themedStyles.editIcon}
    fill={brightWhite}
    name="edit-outline"
  />
);

type PlaylistPreparationRouteProp = RouteProp<StackParamList, 'PlaylistPreparation'>;

const PlaylistPreparation = () => {
  const navigation = useNavigation();
  const route = useRoute<PlaylistPreparationRouteProp>();
  const {playlistId} = route.params;

  const {playlists, setPlaylists} = useContext(PlaylistContext);
  const {meditationBaseData} = useContext(MeditationBaseDataContext);
  const {meditationFilePaths} = useContext(MeditationFilePathsContext);
  const {meditationInstanceData, setMeditationInstanceData} = useContext(
    MeditationInstanceDataContext,
  );
  const {setMeditationSession} = useContext(MeditationSessionContext);
  const {user} = useContext(UserContext);

  const [inputValue, setInputValue] = useState(EMPTY_STRING);
  const [removedMeditationNames, setRemovedMeditationNames] = useState<string[]>([]);
  const styles = useStyleSheet(themedStyles);
  const hasCleanedUp = useRef(false);

  const playlist = playlists[playlistId];

  useEffect(() => {
    const now = new Date();
    const meditationStartTime = now.getTime() / oneSecond;
    setMeditationInstanceData({
      ...meditationInstanceData,
      meditationStartTime,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-clean stale meditation references
  useEffect(() => {
    if (!playlist || hasCleanedUp.current) {
      return;
    }

    const validIds = playlist.meditationIds.filter(
      medId => meditationBaseData[medId] && meditationFilePaths[medId],
    );

    const removedCount = playlist.meditationIds.length - validIds.length;
    if (removedCount === 0) {
      return;
    }

    hasCleanedUp.current = true;

    // Capture names of removed meditations before cleaning up
    const removedIds = playlist.meditationIds.filter(
      medId => !meditationBaseData[medId] || !meditationFilePaths[medId],
    );
    const removedNames = removedIds.map(
      medId => getFullMeditationCatalogSync()[medId]?.name || 'Unknown Meditation',
    );
    setRemovedMeditationNames(removedNames);

    const updatedPlaylist = {
      ...playlist,
      meditationIds: validIds,
      updatedAt: Date.now(),
    };

    const updatedPlaylists = {
      ...playlists,
      [playlistId]: updatedPlaylist,
    };

    setPlaylists(updatedPlaylists);
    setPlaylistsInAsyncStorage(updatedPlaylists);

    if (user?.uid) {
      fbUpdatePlaylist(user.uid, playlistId, {meditationIds: validIds});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist]);

  const onBackPress = () => {
    navigation.goBack();
  };

  const onEditPress = () => {
    // @ts-ignore
    navigation.navigate('EditPlaylist', {playlistId});
  };

  const onBeginPress = () => {
    // Update lastInteractedAt for sorting
    const now = Date.now();
    const updatedPlaylist = {...playlist, lastInteractedAt: now};
    const updatedPlaylists = {...playlists, [playlistId]: updatedPlaylist};
    setPlaylists(updatedPlaylists);
    setPlaylistsInAsyncStorage(updatedPlaylists);
    if (user?.uid) {
      fbUpdatePlaylist(user.uid, playlistId, {lastInteractedAt: now});
    }

    // Create meditation instances for all meditations in playlist
    const meditationInstances = playlist.meditationIds.map(medId => {
      const med = meditationBaseData[medId];
      return {
        meditationBaseId: med.meditationBaseId,
        name: med.name,
        type: med.type,
        // timeMeditated will be added in MeditationPlayer
      };
    });

    // Initialize MeditationSession for playlist
    setMeditationSession({
      intention: inputValue,
      playlistId,
      playlistName: playlist?.name,
      sessionStartTime: meditationInstanceData.meditationStartTime,
      instances: meditationInstances,  // Pre-populate with all meditations
    });

    // Keep existing for backward compatibility
    setMeditationInstanceData({
      ...meditationInstanceData,
      intention: inputValue,
      playlistId,
    });

    const firstMeditationId = playlist.meditationIds[0];
    // @ts-ignore
    navigation.navigate('MeditationPlayer', {
      id: firstMeditationId,
      playlistId,
    });
  };

  const calculateTotalDuration = (): number => {
    let totalMinutes = 0;
    playlist.meditationIds.forEach(medId => {
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

  if (!playlist) {
    return (
      <Layout level="4" style={styles.container}>
        <View style={styles.errorContainer}>
          <Text category="h6" style={styles.errorText}>
            Playlist not found
          </Text>
        </View>
      </Layout>
    );
  }

  const totalDuration = calculateTotalDuration();
  const trackCount = playlist.meditationIds.length;

  return (
    <Layout level="4" style={styles.container}>
      <KeyboardAwareScrollView>
        <View style={styles.topBar}>
          <View style={styles.topLineContainer}>
            <TouchableWithoutFeedback
              style={styles.topBarIcon}
              onPress={onBackPress}>
              <View style={styles.backIconContainer}>
                <BackIcon />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              style={styles.topBarIcon}
              onPress={onEditPress}>
              <View style={styles.editIconContainer}>
                <EditIcon />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <Text category="h5" style={styles.topBarText}>
            {playlist.name}
          </Text>
        </View>

        <View style={styles.mainSection}>
          {/* Playlist Info */}
          <View style={styles.playlistInfoContainer}>
            {playlist.description && (
              <Text category="s1" style={styles.description}>
                {playlist.description}
              </Text>
            )}
            <Text category="s1" style={styles.metaText}>
              {trackCount} {trackCount === 1 ? 'track' : 'tracks'} • {formatDuration(totalDuration)}
            </Text>
          </View>

          {/* Removed Meditations Warning */}
          {removedMeditationNames.length > 0 && (
            <View style={styles.warningBanner}>
              <View style={styles.warningHeaderRow}>
                <Icon
                  style={styles.warningIcon}
                  fill="#E28E69"
                  name="alert-circle-outline"
                />
                <Text category="s1" style={styles.warningTitle}>
                  The following meditations were removed from this playlist:
                </Text>
              </View>
              {removedMeditationNames.map((name, index) => (
                <Text key={index} category="c1" style={styles.warningItemText}>
                  {'\u2022'} {name}
                </Text>
              ))}
            </View>
          )}

          {/* Meditations Preview */}
          <View style={styles.meditationsPreviewContainer}>
            <Text category="h6" style={styles.sectionLabel}>
              Meditations
            </Text>
            {trackCount === 0 ? (
              <View style={styles.emptyPlaylistContainer}>
                <Icon
                  style={styles.emptyPlaylistIcon}
                  fill="#9CA3AF"
                  name="music-outline"
                />
                <Text category="s1" style={styles.emptyPlaylistText}>
                  All meditations in this playlist have been removed
                </Text>
                <_Button
                  appearance="outline"
                  status="basic"
                  size="small"
                  onPress={onEditPress}
                  style={styles.emptyPlaylistButton}>
                  Edit Playlist
                </_Button>
              </View>
            ) : (
              playlist.meditationIds.map((medId, index) => {
                const meditation = meditationBaseData[medId];
                if (!meditation) {
                  return null;
                }
                return (
                  <View key={medId} style={styles.meditationPreviewItem}>
                    <View style={styles.meditationNumberContainer}>
                      <Text category="c1" style={styles.meditationNumber}>
                        {index + 1}
                      </Text>
                    </View>
                    <View style={styles.meditationPreviewInfo}>
                      <Text category="p2" style={styles.meditationPreviewName}>
                        {meditation.name}
                      </Text>
                      <Text category="c1" style={styles.meditationPreviewDuration}>
                        {formatDuration(parseInt(meditation.formattedDuration, 10))}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>

          {/* Intention Input */}
          {trackCount > 0 && (
            <View style={styles.intentionContainer}>
              <Text category="h6" style={styles.thinkBoxLabel}>
                Set an Intention
              </Text>
              <MultiLineInput
                onChangeText={setInputValue}
                placeholder="Set an intention for this playlist session"
                value={inputValue}
                style={styles.thinkBoxStyles}
                textStyle={styles.thinkBoxTextStyles}
              />
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>

      <Layout style={styles.bottomBar}>
        <LinearGradient
          colors={['transparent', '#0B0E18', '#0B0E18']}
          style={styles.bottomBarGradient}>
          <_Button
            onPress={onBeginPress}
            disabled={trackCount === 0}
            size="large"
            style={styles.startButton}>
            BEGIN PLAYLIST
          </_Button>
        </LinearGradient>
      </Layout>
    </Layout>
  );
};

const themedStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingTop: 50,
    marginBottom: 10,
  },
  topLineContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingRight: 20,
  },
  topBarText: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  topBarIcon: {
    flex: 1,
  },
  backIcon: {
    height: 36,
    width: 36,
  },
  backIconContainer: {
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    marginTop: 10,
  },
  editIcon: {
    height: 30,
    width: 30,
  },
  editIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  mainSection: {
    flex: 6,
    justifyContent: 'flex-end',
    paddingBottom: 240,
  },
  playlistInfoContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  description: {
    opacity: 0.8,
    marginBottom: 10,
  },
  metaText: {
    color: '#9CA3AF',
  },
  warningBanner: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: 'rgba(226, 142, 105, 0.12)',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(226, 142, 105, 0.25)',
  },
  warningHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  warningIcon: {
    height: 20,
    width: 20,
    marginRight: 8,
    marginTop: 2,
  },
  warningTitle: {
    color: '#E28E69',
    flex: 1,
  },
  warningItemText: {
    color: '#E28E69',
    marginLeft: 28,
    marginBottom: 2,
  },
  meditationsPreviewContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionLabel: {
    marginBottom: 16,
    opacity: 0.9,
  },
  meditationPreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  meditationNumberContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(156, 77, 204, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  meditationNumber: {
    color: brightWhite,
    fontWeight: '600',
  },
  meditationPreviewInfo: {
    flex: 1,
  },
  meditationPreviewName: {
    color: brightWhite,
    marginBottom: 2,
  },
  meditationPreviewDuration: {
    color: '#9CA3AF',
  },
  intentionContainer: {
    paddingHorizontal: 20,
  },
  thinkBoxLabel: {
    marginBottom: 14,
    opacity: 0.9,
  },
  thinkBoxStyles: {
    backgroundColor: 'rgba(48,55,75,0.6)',
    marginBottom: 60,
  },
  thinkBoxTextStyles: {
    minHeight: 100,
  },
  bottomBar: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  bottomBarGradient: {
    height: 220,
    paddingBottom: 20,
    justifyContent: 'flex-end',
  },
  startButton: {
    marginBottom: 40,
    marginHorizontal: 20,
  },
  emptyPlaylistContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyPlaylistIcon: {
    height: 48,
    width: 48,
    marginBottom: 16,
  },
  emptyPlaylistText: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyPlaylistButton: {
    marginTop: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: brightWhite,
  },
});

export default PlaylistPreparation;

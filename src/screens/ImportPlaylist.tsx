import React, {useContext, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {Icon, Layout, Text, useStyleSheet} from '@ui-kitten/components';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import {usePostHog} from 'posthog-react-native';

import _Button from '../components/Button';
import {StackParamList} from '../types';
import {brightWhite} from '../constants/colors';
import {playlistGradients} from '../constants/colors';
import MeditationBaseDataContext from '../contexts/meditationBaseData';
import PlaylistContext from '../contexts/playlist';
import UserContext from '../contexts/userData';
import {decodePlaylist} from '../utils/sharePlaylist';
import {fbCreatePlaylist} from '../fb/playlists';
import {setPlaylistsInAsyncStorage} from '../utils/asyncStoragePlaylists';
import {capturePlaylistFlowEvent} from '../analytics/posthog';

type ImportPlaylistRouteProp = RouteProp<StackParamList, 'ImportPlaylist'>;

const BackIcon = (props: any) => (
  <Icon
    {...props}
    style={themedStyles.backIcon}
    fill={brightWhite}
    name="arrow-back-outline"
  />
);

const calculateTotalDuration = (meditationIds: string[], meditationBaseData: any): number => {
  let totalMinutes = 0;
  meditationIds.forEach(medId => {
    const meditation = meditationBaseData[medId];
    if (meditation && meditation.formattedDuration) {
      const duration = meditation.formattedDuration;
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

const ImportPlaylist = () => {
  const navigation = useNavigation();
  const route = useRoute<ImportPlaylistRouteProp>();
  const posthog = usePostHog();
  const {encodedData} = route.params;

  const {meditationBaseData} = useContext(MeditationBaseDataContext);
  const {playlists, setPlaylists} = useContext(PlaylistContext);
  const {user} = useContext(UserContext);

  const [saving, setSaving] = useState(false);
  const styles = useStyleSheet(themedStyles);

  const decoded = decodePlaylist(encodedData);

  const isVersionMismatch = !decoded && (() => {
    try {
      const match = encodedData.match(/[?&]data=([^&]+)/);
      if (!match) {return false;}
      const encoded = match[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(escape(atob(encoded)));
      const payload = JSON.parse(json);
      return payload && typeof payload.v === 'number' && payload.v > 1;
    } catch {
      return false;
    }
  })();

  const validIds = decoded
    ? decoded.meditationIds.filter(id => meditationBaseData[id])
    : [];
  const unknownIds = decoded
    ? decoded.meditationIds.filter(id => !meditationBaseData[id])
    : [];
  const totalDuration = calculateTotalDuration(validIds, meditationBaseData);
  const gradientColors =
    playlistGradients[decoded?.gradientIndex ?? 0]?.colors ??
    playlistGradients[0].colors;

  useEffect(() => {
    if (decoded && posthog) {
      capturePlaylistFlowEvent(posthog, 'playlist_import_viewed', {
        meditation_count: decoded.meditationIds.length,
        unknown_count: unknownIds.length,
      });
    } else if (!decoded && posthog) {
      capturePlaylistFlowEvent(posthog, 'playlist_import_failed');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onBackPress = () => {
    navigation.goBack();
  };

  const onCancelPress = () => {
    if (posthog && decoded) {
      capturePlaylistFlowEvent(posthog, 'playlist_import_cancelled', {
        meditation_count: decoded.meditationIds.length,
      });
    }
    navigation.goBack();
  };

  const onSavePress = async () => {
    if (!decoded || validIds.length === 0 || !user?.uid) {
      return;
    }
    setSaving(true);
    try {
      const newPlaylist = {
        name: decoded.name,
        description: decoded.description,
        meditationIds: validIds,
        totalDuration: totalDuration,
        gradientIndex: decoded.gradientIndex,
        lastInteractedAt: Date.now(),
      };

      const playlistId = await fbCreatePlaylist(user.uid, newPlaylist);
      const fullPlaylist = {
        ...newPlaylist,
        playlistId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const updatedPlaylists = {...playlists, [playlistId]: fullPlaylist};
      setPlaylists(updatedPlaylists);
      setPlaylistsInAsyncStorage(updatedPlaylists);

      if (posthog) {
        capturePlaylistFlowEvent(posthog, 'playlist_import_confirmed', {
          meditation_count: decoded.meditationIds.length,
          valid_count: validIds.length,
          unknown_count: unknownIds.length,
        });
      }

      Toast.show({type: 'success', text1: 'Playlist saved!'});
      // @ts-ignore
      navigation.navigate('PlaylistPreparation', {playlistId});
    } catch {
      Toast.show({type: 'error', text1: 'Failed to save playlist'});
    } finally {
      setSaving(false);
    }
  };

  // Error state
  if (!decoded) {
    return (
      <Layout level="4" style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.topLineContainer}>
            <TouchableWithoutFeedback onPress={onBackPress}>
              <View style={styles.backIconContainer}>
                <BackIcon />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <Text category="h5" style={styles.topBarText}>
            Import Playlist
          </Text>
        </View>
        <View style={styles.errorContainer}>
          <Icon style={styles.errorIcon} fill="#E28E69" name="alert-circle-outline" />
          <Text category="h6" style={styles.errorTitle}>
            {isVersionMismatch ? 'Please update your app' : 'Invalid playlist link'}
          </Text>
          <Text category="s1" style={styles.errorSubtitle}>
            {isVersionMismatch
              ? 'This playlist was shared from a newer version of the app.'
              : 'This link appears to be corrupted or invalid.'}
          </Text>
          <_Button
            appearance="outline"
            status="basic"
            onPress={onBackPress}
            style={styles.goBackButton}>
            Go Back
          </_Button>
        </View>
      </Layout>
    );
  }

  return (
    <Layout level="4" style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.topLineContainer}>
          <TouchableWithoutFeedback onPress={onBackPress}>
            <View style={styles.backIconContainer}>
              <BackIcon />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <Text category="h5" style={styles.topBarText}>
          Import Playlist
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Gradient swatch */}
        <LinearGradient
          colors={gradientColors}
          style={styles.gradientSwatch}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
        />

        {/* Playlist name and description */}
        <View style={styles.infoContainer}>
          <Text category="h5" style={styles.playlistName}>
            {decoded.name}
          </Text>
          {decoded.description ? (
            <Text category="s1" style={styles.description}>
              {decoded.description}
            </Text>
          ) : null}
          <Text category="s2" style={styles.metaText}>
            {validIds.length} {validIds.length === 1 ? 'track' : 'tracks'} •{' '}
            {formatDuration(totalDuration)}
          </Text>
        </View>

        {/* Warning banner for unknown IDs */}
        {unknownIds.length > 0 && (
          <View style={styles.warningBanner}>
            <View style={styles.warningHeaderRow}>
              <Icon style={styles.warningIcon} fill="#E28E69" name="alert-circle-outline" />
              <Text category="s1" style={styles.warningTitle}>
                {unknownIds.length}{' '}
                {unknownIds.length === 1 ? 'meditation' : 'meditations'} in this
                playlist {unknownIds.length === 1 ? 'is' : 'are'} not available in
                your catalog and will be skipped.
              </Text>
            </View>
          </View>
        )}

        {/* Meditation list */}
        <View style={styles.meditationsContainer}>
          <Text category="h6" style={styles.sectionLabel}>
            Meditations
          </Text>
          {decoded.meditationIds.map((medId, index) => {
            const meditation = meditationBaseData[medId];
            const isUnavailable = !meditation;
            return (
              <View
                key={`${medId}-${index}`}
                style={[
                  styles.meditationItem,
                  isUnavailable && styles.meditationItemUnavailable,
                ]}>
                <View style={styles.meditationNumberContainer}>
                  <Text category="c1" style={styles.meditationNumber}>
                    {index + 1}
                  </Text>
                </View>
                <View style={styles.meditationInfo}>
                  <Text
                    category="p2"
                    style={[
                      styles.meditationName,
                      isUnavailable && styles.meditationNameUnavailable,
                    ]}>
                    {isUnavailable ? 'Unavailable' : meditation.name}
                  </Text>
                  {!isUnavailable && (
                    <Text category="c1" style={styles.meditationDuration}>
                      {formatDuration(parseInt(meditation.formattedDuration, 10))}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <Layout style={styles.bottomBar}>
        <LinearGradient
          colors={['transparent', '#0B0E18', '#0B0E18']}
          style={styles.bottomBarGradient}>
          <View style={styles.buttonRow}>
            <_Button
              appearance="outline"
              status="basic"
              onPress={onCancelPress}
              style={styles.cancelButton}>
              Cancel
            </_Button>
            <_Button
              onPress={onSavePress}
              disabled={validIds.length === 0 || saving}
              style={styles.saveButton}>
              Save to My Playlists
            </_Button>
          </View>
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
    paddingBottom: 10,
    paddingTop: 50,
    marginBottom: 4,
  },
  topLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 20,
  },
  topBarText: {
    paddingHorizontal: 20,
    paddingTop: 20,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 240,
  },
  gradientSwatch: {
    height: 80,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 20,
    borderRadius: 12,
  },
  infoContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  playlistName: {
    marginBottom: 8,
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
    marginBottom: 20,
    backgroundColor: 'rgba(226, 142, 105, 0.12)',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(226, 142, 105, 0.25)',
  },
  warningHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  meditationsContainer: {
    paddingHorizontal: 20,
  },
  sectionLabel: {
    marginBottom: 16,
    opacity: 0.9,
  },
  meditationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  meditationItemUnavailable: {
    opacity: 0.4,
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
  meditationInfo: {
    flex: 1,
  },
  meditationName: {
    color: brightWhite,
    marginBottom: 2,
  },
  meditationNameUnavailable: {
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  meditationDuration: {
    color: '#9CA3AF',
  },
  bottomBar: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  bottomBarGradient: {
    height: 180,
    paddingBottom: 20,
    justifyContent: 'flex-end',
  },
  buttonRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorIcon: {
    height: 56,
    width: 56,
    marginBottom: 20,
  },
  errorTitle: {
    color: brightWhite,
    textAlign: 'center',
    marginBottom: 12,
  },
  errorSubtitle: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 32,
  },
  goBackButton: {
    minWidth: 160,
  },
});

export default ImportPlaylist;

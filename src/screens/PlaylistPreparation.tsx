import React, {useContext, useState, useEffect} from 'react';
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
import PlaylistContext from '../contexts/playlist';
import MeditationBaseDataContext from '../contexts/meditationBaseData';
import {brightWhite} from '../constants/colors';

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

  const {playlists} = useContext(PlaylistContext);
  const {meditationBaseData} = useContext(MeditationBaseDataContext);
  const {meditationInstanceData, setMeditationInstanceData} = useContext(
    MeditationInstanceDataContext,
  );

  const [inputValue, setInputValue] = useState(EMPTY_STRING);
  const styles = useStyleSheet(themedStyles);

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

  const onBackPress = () => {
    navigation.goBack();
  };

  const onEditPress = () => {
    // @ts-ignore
    navigation.navigate('EditPlaylist', {playlistId});
  };

  const onBeginPress = () => {
    setMeditationInstanceData({
      ...meditationInstanceData,
      intention: inputValue,
      playlistId,
    });

    // TODO: Navigate to MeditationPlayer with playlistId
    // navigation.navigate('MeditationPlayer', {playlistId});
    console.log('Begin playlist:', playlistId, 'with intention:', inputValue);
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

          {/* Meditations Preview */}
          <View style={styles.meditationsPreviewContainer}>
            <Text category="h6" style={styles.sectionLabel}>
              Meditations
            </Text>
            {playlist.meditationIds.map((medId, index) => {
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
            })}
          </View>

          {/* Intention Input */}
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
        </View>
      </KeyboardAwareScrollView>

      <Layout style={styles.bottomBar}>
        <LinearGradient
          colors={['transparent', '#0B0E18', '#0B0E18']}
          style={styles.bottomBarGradient}>
          <_Button
            onPress={onBeginPress}
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

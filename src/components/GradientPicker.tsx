import React, {useRef, useEffect} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon, Text} from '@ui-kitten/components';
import LinearGradient from 'react-native-linear-gradient';
import {playlistGradients, PlaylistGradient} from '../constants/colors';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const SELECTED_WIDTH = 160;
const SELECTED_HEIGHT = 160;
const UNSELECTED_SIZE = 80;
const TILE_GAP = 12;

interface GradientPickerProps {
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const calculateScrollOffset = (selectedIndex: number): number => {
  return Math.max(0, TILE_GAP / 2 + selectedIndex * (UNSELECTED_SIZE + TILE_GAP));
};

export const GradientPicker = ({
  selectedIndex,
  onSelect,
}: GradientPickerProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const hasScrolledInitially = useRef(false);

  useEffect(() => {
    if (scrollViewRef.current && hasScrolledInitially.current) {
      scrollViewRef.current.scrollTo({
        x: calculateScrollOffset(selectedIndex),
        animated: true,
      });
    }
  }, [selectedIndex]);

  const handleLayout = () => {
    if (scrollViewRef.current && !hasScrolledInitially.current) {
      hasScrolledInitially.current = true;
      scrollViewRef.current.scrollTo({
        x: calculateScrollOffset(selectedIndex),
        animated: false,
      });
    }
  };

  const renderTile = (item: PlaylistGradient, index: number) => {
    const isSelected = index === selectedIndex;
    const tileWidth = isSelected ? SELECTED_WIDTH : UNSELECTED_SIZE;
    const tileHeight = isSelected ? SELECTED_HEIGHT : UNSELECTED_SIZE;

    return (
      <TouchableOpacity
        key={`gradient-${index}`}
        onPress={() => onSelect(index)}
        style={styles.tileWrapper}>
        <LinearGradient
          colors={item.colors}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[
            styles.tile,
            {width: tileWidth, height: tileHeight},
            isSelected && styles.selectedTile,
          ]}>
          {isSelected && (
            <>
              <View style={styles.iconCircle}>
                <Icon
                  name="music-outline"
                  fill="#FFFFFF"
                  style={styles.musicIcon}
                />
              </View>
              <View style={styles.namePill}>
                <Text style={styles.nameText}>{item.name}</Text>
              </View>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  // Padding so first and last items can be centered
  const edgePadding = (SCREEN_WIDTH - SELECTED_WIDTH) / 2;

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        styles.listContent,
        {paddingHorizontal: edgePadding},
      ]}
      onLayout={handleLayout}>
      {playlistGradients.map(renderTile)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  listContent: {
    alignItems: 'center',
    minHeight: SELECTED_HEIGHT + 16,
  },
  tileWrapper: {
    marginHorizontal: TILE_GAP / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tile: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTile: {
    borderWidth: 2,
    borderColor: '#9C4DCC',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  musicIcon: {
    width: 24,
    height: 24,
  },
  namePill: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  nameText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 10,
    letterSpacing: 1,
  },
});

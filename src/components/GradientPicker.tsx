import React, {useRef, useEffect} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {playlistGradients, PlaylistGradient} from '../constants/colors';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const SELECTED_WIDTH = 100;
const SELECTED_HEIGHT = 100;
const UNSELECTED_SIZE = 60;
const TILE_GAP = 20;

interface GradientPickerProps {
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const calculateScrollOffset = (selectedIndex: number): number => {
  return Math.max(
    0,
    TILE_GAP / 2 + selectedIndex * (UNSELECTED_SIZE + TILE_GAP),
  );
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
          ]}></LinearGradient>
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
});

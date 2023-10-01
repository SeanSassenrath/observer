import React from 'react';
import {
  Canvas,
  Skia,
  Path,
  useComputedValue,
  useClockValue,
  useValue,
} from '@shopify/react-native-skia';
import {Dimensions, StyleSheet} from 'react-native';
import {line, curveBasis} from 'd3';

export const Wave = () => {
  const dimens = Dimensions.get('screen');
  const width = dimens.width;
  const frequency = 2;
  const initialAmplitude = 40;
  const verticalShiftConst = 100;
  const height = 150;
  const horizontalShift = (dimens.width - width) / 2;

  const verticalShift = useValue(verticalShiftConst);
  const amplitude = useValue(initialAmplitude);
  const clock = useClockValue();

  const createWavePath = (phase = 20) => {
    let points = Array.from({length: width + horizontalShift}, (_, index) => {
      const angle =
        ((index - horizontalShift) / width) * (Math.PI * frequency) + phase;
      return [
        index,
        amplitude.current * Math.sin(angle) + verticalShift.current,
      ];
    });

    const shiftedPoints = points.slice(horizontalShift, dimens.width * 2) as [
      number,
      number,
    ][];

    const lineGenerator = line().curve(curveBasis);
    const waveLine = lineGenerator(shiftedPoints);
    const bottomLine = `L${
      width + horizontalShift
    },${height} L${horizontalShift},${height}`;
    const extendedWavePath = `${waveLine} ${bottomLine} Z`;
    return extendedWavePath;
  };

  const animatedPath = useComputedValue(() => {
    const current = (clock.current / 1700) % 225;
    const start = Skia.Path.MakeFromSVGString(createWavePath(current))!;
    const end = Skia.Path.MakeFromSVGString(createWavePath(Math.PI * current))!;
    return start.interpolate(end, 0.5)!;
  }, [clock, verticalShift]);

  return (
    <Canvas style={styles.canvas}>
      <Path
        path={animatedPath}
        style={'stroke'}
        color="white"
        strokeWidth={5}
      />
    </Canvas>
  );
};

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    marginLeft: -10,
  },
});

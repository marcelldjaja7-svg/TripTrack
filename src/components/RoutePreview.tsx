import React, { useMemo } from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import type { GeoPoint } from '../types';
import { pointsToSvgPath } from '../utils/geo';
import { colors } from '../theme';

type Props = {
  points: GeoPoint[];
  width: number;
  height: number;
  stroke?: string;
  background?: string;
};

export function RoutePreview({
  points,
  width,
  height,
  stroke = colors.mapTrack,
  background = '#EDE9E3',
}: Props) {
  const d = useMemo(
    () => pointsToSvgPath(points, width, height, 18),
    [points, width, height],
  );

  return (
    <Svg width={width} height={height}>
      <Rect x={0} y={0} width={width} height={height} fill={background} rx={0} />
      {d ? (
        <Path
          d={d}
          stroke={stroke}
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
    </Svg>
  );
}

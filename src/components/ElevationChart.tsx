import React, { useMemo } from 'react';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import type { GeoPoint } from '../types';
import { elevationProfile } from '../utils/geo';
import { colors } from '../theme';

type Props = {
  points: GeoPoint[];
  width: number;
  height: number;
};

export function ElevationChart({ points, width, height }: Props) {
  const line = useMemo(
    () => elevationProfile(points, width, height),
    [points, width, height],
  );
  const area = line
    ? `${line} L ${width},${height} L 0,${height} Z`
    : '';

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id="elevFill" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={colors.route} stopOpacity={0.35} />
          <Stop offset="100%" stopColor={colors.route} stopOpacity={0.02} />
        </LinearGradient>
      </Defs>
      {area ? <Path d={area} fill="url(#elevFill)" /> : null}
      {line ? (
        <Path
          d={line}
          stroke={colors.route}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
      ) : null}
    </Svg>
  );
}

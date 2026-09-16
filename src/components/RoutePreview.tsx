import React, { useMemo } from 'react';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import type { GeoPoint } from '../types';
import { pointsToSvgPath } from '../utils/geo';
import { colors } from '../theme';

type Props = {
  points: GeoPoint[];
  width: number;
  height: number;
  stroke?: string;
  background?: string;
  glow?: boolean;
  showEndpoints?: boolean;
};

export function RoutePreview({
  points,
  width,
  height,
  stroke = colors.route,
  background = '#E8EEF5',
  glow = false,
  showEndpoints = false,
}: Props) {
  const d = useMemo(
    () => pointsToSvgPath(points, width, height, 22),
    [points, width, height],
  );

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id="mapFade" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor={background} />
          <Stop offset="100%" stopColor="#D5DEE8" />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill="url(#mapFade)" />
      {/* faux map grid */}
      {[0.25, 0.5, 0.75].map((t) => (
        <Path
          key={`h-${t}`}
          d={`M 0 ${height * t} H ${width}`}
          stroke="rgba(15,23,42,0.05)"
          strokeWidth={1}
        />
      ))}
      {d ? (
        <>
          {glow ? (
            <Path
              d={d}
              stroke={colors.routeGlow}
              strokeWidth={10}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.35}
            />
          ) : null}
          <Path
            d={d}
            stroke={stroke}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : null}
      {showEndpoints && points.length > 1 ? (
        <>
          <Circle
            cx={22}
            cy={height - 22}
            r={8}
            fill={colors.ink}
            stroke="#fff"
            strokeWidth={2}
          />
          <Circle
            cx={width - 22}
            cy={22}
            r={8}
            fill={colors.route}
            stroke="#fff"
            strokeWidth={2}
          />
        </>
      ) : null}
    </Svg>
  );
}

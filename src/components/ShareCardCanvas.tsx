import React, { forwardRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ShareDesign, Trip } from '../types';
import { RoutePreview } from './RoutePreview';
import {
  formatDistance,
  formatDuration,
  formatSpeed,
} from '../utils/format';

const TEMPLATES: Record<
  ShareDesign['templateId'],
  { bg: string; fg: string; muted: string; mapBg: string }
> = {
  sunset: {
    bg: '#2B1A12',
    fg: '#FFE8D6',
    muted: '#E8B89A',
    mapBg: '#3A2418',
  },
  night: {
    bg: '#0B1220',
    fg: '#E8EEF8',
    muted: '#8FA0B8',
    mapBg: '#141E30',
  },
  minimal: {
    bg: '#F7F4EF',
    fg: '#1A1A1A',
    muted: '#6B6B6B',
    mapBg: '#E8E2D8',
  },
  postcard: {
    bg: '#FFF8F0',
    fg: '#1F1A14',
    muted: '#7A6A58',
    mapBg: '#F0E6D8',
  },
  trail: {
    bg: '#14231A',
    fg: '#E8F5E9',
    muted: '#9CBC9F',
    mapBg: '#1C3224',
  },
};

type Props = {
  trip: Trip;
  design: ShareDesign;
  width?: number;
};

export const ShareCardCanvas = forwardRef<View, Props>(function ShareCardCanvas(
  { trip, design, width = 360 },
  ref,
) {
  const theme = TEMPLATES[design.templateId];
  const height = Math.round(width * 1.25);
  const mapH = Math.round(width * 0.55);
  const accent = design.accentColor;

  const chips: { label: string; value: string }[] = [];
  if (design.showDistance) {
    chips.push({ label: 'Distance', value: formatDistance(trip.distanceMeters) });
  }
  if (design.showDuration) {
    chips.push({ label: 'Time', value: formatDuration(trip.durationMs) });
  }
  if (design.showAvgSpeed) {
    chips.push({ label: 'Avg speed', value: formatSpeed(trip.avgSpeedMps) });
  }

  return (
    <View
      ref={ref}
      collapsable={false}
      style={[
        styles.card,
        {
          width,
          height,
          backgroundColor: theme.bg,
          borderColor: design.templateId === 'postcard' ? accent : 'transparent',
          borderWidth: design.templateId === 'postcard' ? 3 : 0,
        },
      ]}
    >
      <Text style={[styles.brand, { color: accent }]}>TripTrack</Text>
      <Text style={[styles.title, { color: theme.fg }]} numberOfLines={2}>
        {design.title || trip.title}
      </Text>
      {design.subtitle ? (
        <Text style={[styles.subtitle, { color: theme.muted }]} numberOfLines={2}>
          {design.subtitle}
        </Text>
      ) : null}

      {design.showRoute ? (
        <View style={styles.map}>
          <RoutePreview
            points={trip.points}
            width={width - 40}
            height={mapH}
            stroke={accent}
            background={theme.mapBg}
          />
        </View>
      ) : (
        <View style={{ height: 24 }} />
      )}

      <View style={{ flex: 1 }} />

      <View style={styles.metrics}>
        {chips.map((c) => (
          <View key={c.label} style={styles.metric}>
            <Text style={[styles.metricValue, { color: theme.fg }]}>{c.value}</Text>
            <Text style={[styles.metricLabel, { color: theme.muted }]}>{c.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: 20,
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  brand: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  title: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 28,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  subtitle: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 15,
    marginTop: 6,
  },
  map: {
    marginTop: 18,
    borderRadius: 10,
    overflow: 'hidden',
  },
  metrics: {
    flexDirection: 'row',
    paddingTop: 18,
    gap: 8,
  },
  metric: {
    flex: 1,
  },
  metricValue: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
  },
  metricLabel: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
});

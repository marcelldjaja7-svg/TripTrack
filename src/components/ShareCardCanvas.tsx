import React, { forwardRef } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { ShareDesign, Trip } from '../types';
import { RoutePreview } from './RoutePreview';
import {
  formatDistance,
  formatDurationShort,
  formatElevation,
  formatWhen,
} from '../utils/format';
import { colors } from '../theme';

type Props = {
  trip: Trip;
  design: ShareDesign;
  width?: number;
};

export const ShareCardCanvas = forwardRef<View, Props>(function ShareCardCanvas(
  { trip, design, width = 320 },
  ref,
) {
  const height = Math.round(width * 1.78);
  const mapW = Math.round(width * 0.34);
  const mapH = Math.round(mapW * 0.9);
  const accent = design.accentColor;

  if (design.templateId === 'story' || design.templateId === 'photo') {
    return (
      <View ref={ref} collapsable={false} style={{ width, height }}>
        <ImageBackground
          source={{ uri: trip.coverUri }}
          style={styles.fill}
        >
          <LinearGradient
            colors={['rgba(8,12,18,0.25)', 'rgba(8,12,18,0.82)']}
            style={[styles.fill, styles.pad]}
          >
            <View style={styles.topRow}>
              <Text style={[styles.brand, { color: accent }]}>TRIPLY</Text>
              <Text style={styles.date}>{formatWhen(trip.startedAt)}</Text>
            </View>
            <View style={{ flex: 1 }} />
            <Text style={styles.storyTitle}>
              {(design.title || trip.title).toUpperCase()}
            </Text>
            <Text style={styles.storyTags}>
              {design.subtitle || `${trip.mode} · ${trip.locationLabel || 'Trip'}`}
            </Text>
            <View style={styles.storyMetrics}>
              {design.showDistance ? (
                <View style={styles.storyMetric}>
                  <Text style={styles.storyValue}>
                    {formatDistance(trip.distanceMeters)}
                  </Text>
                  <Text style={styles.storyLabel}>Distance</Text>
                </View>
              ) : null}
              {design.showDuration ? (
                <View style={styles.storyMetric}>
                  <Text style={styles.storyValue}>
                    {formatDurationShort(trip.durationMs)}
                  </Text>
                  <Text style={styles.storyLabel}>Time</Text>
                </View>
              ) : null}
              {design.showElevation ? (
                <View style={styles.storyMetric}>
                  <Text style={styles.storyValue}>
                    {formatElevation(trip.elevationGainMeters)}
                  </Text>
                  <Text style={styles.storyLabel}>Elev</Text>
                </View>
              ) : null}
            </View>
            <View style={styles.storyFooter}>
              {design.showRoute ? (
                <View style={styles.miniMap}>
                  <RoutePreview
                    points={trip.points}
                    width={mapW}
                    height={mapH}
                    stroke="#fff"
                    background="rgba(255,255,255,0.12)"
                  />
                </View>
              ) : (
                <View />
              )}
              <Text style={styles.quote}>Collect Trips{'\n'}Not Things.</Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    );
  }

  const bg =
    design.templateId === 'map'
      ? '#0B1220'
      : design.templateId === 'stats'
        ? '#111827'
        : design.templateId === 'quote'
          ? '#14110F'
          : '#F7F4EF';
  const fg = design.templateId === 'minimal' ? colors.ink : '#F8FAFC';
  const muted = design.templateId === 'minimal' ? colors.inkMuted : '#94A3B8';

  return (
    <View
      ref={ref}
      collapsable={false}
      style={[styles.card, { width, height, backgroundColor: bg }]}
    >
      <Text style={[styles.brand, { color: accent }]}>TRIPLY</Text>
      <Text style={[styles.title, { color: fg }]} numberOfLines={2}>
        {design.title || trip.title}
      </Text>
      <Text style={[styles.sub, { color: muted }]} numberOfLines={2}>
        {design.subtitle || trip.caption || 'Tracked with Triply'}
      </Text>
      {design.showRoute ? (
        <View style={styles.mapBlock}>
          <RoutePreview
            points={trip.points}
            width={width - 40}
            height={Math.round(width * 0.55)}
            stroke={accent}
            background={design.templateId === 'minimal' ? '#E8E2D8' : '#1E293B'}
            glow
            showEndpoints
          />
        </View>
      ) : (
        <View style={{ height: 24 }} />
      )}
      <View style={{ flex: 1 }} />
      <View style={styles.metrics}>
        {design.showDistance ? (
          <View style={styles.metric}>
            <Text style={[styles.metricValue, { color: fg }]}>
              {formatDistance(trip.distanceMeters)}
            </Text>
            <Text style={[styles.metricLabel, { color: muted }]}>Distance</Text>
          </View>
        ) : null}
        {design.showDuration ? (
          <View style={styles.metric}>
            <Text style={[styles.metricValue, { color: fg }]}>
              {formatDurationShort(trip.durationMs)}
            </Text>
            <Text style={[styles.metricLabel, { color: muted }]}>Time</Text>
          </View>
        ) : null}
        {design.showElevation ? (
          <View style={styles.metric}>
            <Text style={[styles.metricValue, { color: fg }]}>
              {formatElevation(trip.elevationGainMeters)}
            </Text>
            <Text style={[styles.metricLabel, { color: muted }]}>Elev</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  fill: { flex: 1 },
  pad: { padding: 20 },
  card: { padding: 20, overflow: 'hidden' },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 13,
    letterSpacing: 2,
  },
  date: {
    fontFamily: 'SourceSans3_400Regular',
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  storyTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 36,
    color: '#fff',
    letterSpacing: -0.8,
    lineHeight: 40,
  },
  storyTags: {
    fontFamily: 'SourceSans3_400Regular',
    color: 'rgba(255,255,255,0.75)',
    marginTop: 8,
    marginBottom: 18,
  },
  storyMetrics: { flexDirection: 'row', gap: 18, marginBottom: 22 },
  storyMetric: {},
  storyValue: {
    fontFamily: 'Outfit_700Bold',
    color: '#fff',
    fontSize: 18,
  },
  storyLabel: {
    fontFamily: 'SourceSans3_400Regular',
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  storyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  miniMap: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  quote: {
    fontFamily: 'Outfit_600SemiBold',
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    textAlign: 'right',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  title: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 28,
    letterSpacing: -0.5,
    marginTop: 10,
  },
  sub: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 14,
    marginTop: 6,
  },
  mapBlock: {
    marginTop: 18,
    borderRadius: 14,
    overflow: 'hidden',
  },
  metrics: { flexDirection: 'row', gap: 10, paddingTop: 16 },
  metric: { flex: 1 },
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

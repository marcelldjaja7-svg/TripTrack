import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Trip } from '../types';
import { colors, radii, spacing, typography } from '../theme';
import {
  formatDistance,
  formatDuration,
  formatSpeed,
  formatWhen,
} from '../utils/format';
import { MetricGrid } from './MetricGrid';
import { RoutePreview } from './RoutePreview';

type Props = {
  trip: Trip;
  onPress: () => void;
  onShare: () => void;
};

export function TripFeedCard({ trip, onPress, onShare }: Props) {
  const { width } = useWindowDimensions();
  const mapWidth = Math.min(width - spacing.md * 2, 520);
  const mapHeight = Math.round(mapWidth * 0.52);

  return (
    <View style={styles.card}>
      <Pressable onPress={onPress} accessibilityRole="button">
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>T</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>You</Text>
            <Text style={styles.meta}>
              {formatWhen(trip.startedAt)}
              {trip.locationLabel ? ` · ${trip.locationLabel}` : ''}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>{trip.title}</Text>

        <MetricGrid
          columns={3}
          metrics={[
            { label: 'Distance', value: formatDistance(trip.distanceMeters) },
            { label: 'Avg speed', value: formatSpeed(trip.avgSpeedMps) },
            { label: 'Time', value: formatDuration(trip.durationMs) },
          ]}
        />

        <View style={styles.mapWrap}>
          <RoutePreview points={trip.points} width={mapWidth} height={mapHeight} />
        </View>
      </Pressable>

      <View style={styles.actions}>
        <Pressable
          style={styles.actionBtn}
          onPress={onShare}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Share design"
        >
          <Ionicons name="share-outline" size={22} color={colors.ink} />
          <Text style={styles.actionLabel}>Share design</Text>
        </Pressable>
        <Pressable
          style={styles.actionBtn}
          onPress={onPress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Trip details"
        >
          <Ionicons name="chevron-forward" size={22} color={colors.ink} />
          <Text style={styles.actionLabel}>Details</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
  },
  name: {
    ...typography.bodyBold,
    color: colors.ink,
  },
  meta: {
    ...typography.caption,
    marginTop: 2,
  },
  title: {
    ...typography.title,
    color: colors.ink,
    marginBottom: 8,
  },
  mapWrap: {
    marginTop: 12,
    overflow: 'hidden',
    borderRadius: radii.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    marginTop: 4,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionLabel: {
    ...typography.bodyBold,
    color: colors.ink,
  },
});

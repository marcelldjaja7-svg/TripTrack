import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MetricGrid } from '../components/MetricGrid';
import { RoutePreview } from '../components/RoutePreview';
import { useTrips } from '../context/TripsContext';
import { useTripTracker } from '../hooks/useTripTracker';
import type { RootStackParamList } from '../types';
import { colors, radii, spacing, typography } from '../theme';
import {
  formatDistance,
  formatDuration,
  formatSpeed,
} from '../utils/format';

export function RecordScreen() {
  const tracker = useTripTracker();
  const { addTrip } = useTrips();
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const [saving, setSaving] = useState(false);
  const mapW = Math.min(width - spacing.md * 2, 520);
  const mapH = Math.round(mapW * 0.55);
  const isLive = tracker.status === 'recording' || tracker.status === 'paused';

  const onStop = async () => {
    setSaving(true);
    const trip = tracker.stop();
    setSaving(false);
    if (!trip) {
      Alert.alert(
        'Trip too short',
        'Keep moving a bit longer so we can capture a route.',
      );
      return;
    }
    await addTrip(trip);
    navigation.navigate('TripDetail', { tripId: trip.id });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Record</Text>
        {tracker.usingSimulation ? (
          <Text style={styles.simBadge}>Demo GPS path</Text>
        ) : null}
      </View>

      <View style={styles.body}>
        <Text style={styles.status}>
          {tracker.status === 'idle' && 'Ready when you are'}
          {tracker.status === 'recording' && 'Tracking live'}
          {tracker.status === 'paused' && 'Paused'}
        </Text>

        <MetricGrid
          columns={2}
          metrics={[
            {
              label: 'Distance',
              value: formatDistance(tracker.stats.distanceMeters),
            },
            {
              label: 'Duration',
              value: formatDuration(tracker.stats.durationMs),
            },
            {
              label: 'Current',
              value: formatSpeed(tracker.stats.currentSpeedMps),
            },
            {
              label: 'Average',
              value: formatSpeed(tracker.stats.avgSpeedMps),
            },
          ]}
        />

        <View style={styles.mapWrap}>
          <RoutePreview
            points={tracker.stats.points}
            width={mapW}
            height={mapH}
            background="#E8E2D8"
          />
        </View>

        {tracker.permissionDenied ? (
          <Text style={styles.hint}>
            Location permission was denied — using a demo route so you can still
            try recording and share designs.
          </Text>
        ) : null}
        {tracker.error ? (
          <Text style={styles.hint}>{tracker.error}</Text>
        ) : null}
      </View>

      <View style={styles.controls}>
        {tracker.status === 'idle' ? (
          <Pressable
            style={[styles.primaryBtn, styles.goBtn]}
            onPress={tracker.start}
            accessibilityRole="button"
            accessibilityLabel="Start trip"
          >
            <Text style={styles.primaryText}>Start trip</Text>
          </Pressable>
        ) : (
          <View style={styles.row}>
            <Pressable
              style={[styles.secondaryBtn]}
              onPress={
                tracker.status === 'paused' ? tracker.resume : tracker.pause
              }
            >
              <Text style={styles.secondaryText}>
                {tracker.status === 'paused' ? 'Resume' : 'Pause'}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.primaryBtn, styles.stopBtn, saving && { opacity: 0.6 }]}
              onPress={onStop}
              disabled={saving}
            >
              <Text style={styles.primaryText}>
                {saving ? 'Saving…' : 'Finish'}
              </Text>
            </Pressable>
          </View>
        )}
        {!isLive ? (
          <Text style={styles.footerHint}>
            Tracks distance, speed, and location — then design a share card.
          </Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  title: { ...typography.brand, color: colors.ink, fontSize: 26 },
  simBadge: {
    ...typography.caption,
    color: colors.primary,
    fontFamily: 'SourceSans3_600SemiBold',
  },
  body: {
    flex: 1,
    padding: spacing.md,
  },
  status: {
    ...typography.heading,
    color: colors.ink,
    marginBottom: spacing.md,
  },
  mapWrap: {
    marginTop: spacing.md,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  hint: {
    ...typography.caption,
    marginTop: spacing.md,
    lineHeight: 18,
  },
  controls: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  row: { flexDirection: 'row', gap: 12 },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  goBtn: { minHeight: 56 },
  stopBtn: { backgroundColor: colors.ink },
  primaryText: {
    fontFamily: 'Outfit_700Bold',
    color: '#fff',
    fontSize: 17,
  },
  secondaryBtn: {
    flex: 1,
    borderRadius: radii.pill,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  secondaryText: {
    fontFamily: 'Outfit_600SemiBold',
    color: colors.ink,
    fontSize: 17,
  },
  footerHint: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: 12,
  },
});

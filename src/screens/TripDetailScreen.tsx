import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MetricGrid } from '../components/MetricGrid';
import { RoutePreview } from '../components/RoutePreview';
import { useTrips } from '../context/TripsContext';
import type { RootStackParamList } from '../types';
import { colors, radii, spacing, typography } from '../theme';
import {
  formatDistance,
  formatDuration,
  formatSpeed,
  formatWhen,
} from '../utils/format';

type Props = StackScreenProps<RootStackParamList, 'TripDetail'>;

export function TripDetailScreen({ route, navigation }: Props) {
  const { tripId } = route.params;
  const { getTrip, updateTrip, removeTrip } = useTrips();
  const trip = getTrip(tripId);
  const { width } = useWindowDimensions();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(trip?.title ?? '');

  if (!trip) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.missing}>Trip not found.</Text>
      </SafeAreaView>
    );
  }

  const mapW = Math.min(width - spacing.md * 2, 560);
  const mapH = Math.round(mapW * 0.6);

  const saveTitle = async () => {
    const next = title.trim() || trip.title;
    await updateTrip({ ...trip, title: next });
    setEditing(false);
  };

  const onDelete = () => {
    Alert.alert('Delete trip?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await removeTrip(trip.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.when}>{formatWhen(trip.startedAt)}</Text>
        {trip.locationLabel ? (
          <Text style={styles.loc}>{trip.locationLabel}</Text>
        ) : null}

        {editing ? (
          <View style={styles.editRow}>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              autoFocus
              placeholder="Trip title"
              placeholderTextColor={colors.inkFaint}
            />
            <Pressable onPress={saveTitle}>
              <Text style={styles.link}>Save</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable onLongPress={() => setEditing(true)}>
            <Text style={styles.title}>{trip.title}</Text>
            <Text style={styles.editHint}>Long-press to rename</Text>
          </Pressable>
        )}

        <MetricGrid
          columns={2}
          metrics={[
            { label: 'Distance', value: formatDistance(trip.distanceMeters) },
            { label: 'Time', value: formatDuration(trip.durationMs) },
            { label: 'Avg speed', value: formatSpeed(trip.avgSpeedMps) },
            { label: 'Max speed', value: formatSpeed(trip.maxSpeedMps) },
          ]}
        />

        <View style={styles.mapWrap}>
          <RoutePreview points={trip.points} width={mapW} height={mapH} />
        </View>

        <Text style={styles.points}>
          {trip.points.length} location points recorded
        </Text>

        <Pressable
          style={styles.shareBtn}
          onPress={() =>
            navigation.navigate('ShareDesigner', { tripId: trip.id })
          }
          accessibilityRole="button"
          accessibilityLabel="Customize and share"
        >
          <Text style={styles.shareText}>Customize & share</Text>
        </Pressable>

        <Pressable style={styles.deleteBtn} onPress={onDelete}>
          <Text style={styles.deleteText}>Delete trip</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  when: { ...typography.caption },
  loc: { ...typography.caption, marginTop: 2 },
  title: {
    ...typography.title,
    fontSize: 28,
    color: colors.ink,
    marginTop: 8,
    marginBottom: 4,
  },
  editHint: { ...typography.caption, marginBottom: 12 },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 20,
    backgroundColor: colors.surface,
    color: colors.ink,
  },
  link: {
    fontFamily: 'SourceSans3_600SemiBold',
    color: colors.primary,
    fontSize: 16,
  },
  mapWrap: {
    marginTop: spacing.md,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  points: { ...typography.caption, marginTop: 10 },
  shareBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  shareText: {
    fontFamily: 'Outfit_700Bold',
    color: '#fff',
    fontSize: 16,
  },
  deleteBtn: {
    marginTop: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteText: {
    fontFamily: 'SourceSans3_600SemiBold',
    color: colors.danger,
  },
  missing: {
    ...typography.body,
    padding: spacing.lg,
  },
});

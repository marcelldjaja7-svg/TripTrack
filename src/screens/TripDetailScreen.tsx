import React, { useState } from 'react';
import {
  Alert,
  Image,
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
import { ElevationChart } from '../components/ElevationChart';
import { RoutePreview } from '../components/RoutePreview';
import { useTrips } from '../context/TripsContext';
import type { RootStackParamList } from '../types';
import { colors, radii, spacing } from '../theme';
import {
  formatDistance,
  formatDurationShort,
  formatElevation,
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
  const mapH = Math.round(mapW * 0.48);
  const chartW = mapW;
  const chartH = 110;

  const saveTitle = async () => {
    await updateTrip({ ...trip, title: title.trim() || trip.title });
    setEditing(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            {editing ? (
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                autoFocus
              />
            ) : (
              <Pressable onLongPress={() => setEditing(true)}>
                <Text style={styles.title}>{trip.title}</Text>
              </Pressable>
            )}
            <Text style={styles.meta}>
              {formatWhen(trip.startedAt)} · {trip.mode}
            </Text>
          </View>
          {trip.coverUri ? (
            <Image source={{ uri: trip.coverUri }} style={styles.thumb} />
          ) : null}
        </View>

        <View style={styles.mapWrap}>
          <RoutePreview
            points={trip.points}
            width={mapW}
            height={mapH}
            showEndpoints
            glow
          />
        </View>

        <View style={styles.grid}>
          {[
            { label: 'Distance', value: formatDistance(trip.distanceMeters) },
            { label: 'Time', value: formatDurationShort(trip.durationMs) },
            { label: 'Avg. Speed', value: formatSpeed(trip.avgSpeedMps) },
            {
              label: 'Elevation Gain',
              value: formatElevation(trip.elevationGainMeters),
            },
            { label: 'Max Speed', value: formatSpeed(trip.maxSpeedMps) },
            { label: 'Calories', value: `${trip.calories} kcal` },
          ].map((m) => (
            <View key={m.label} style={styles.statCard}>
              <Text style={styles.statValue}>{m.value}</Text>
              <Text style={styles.statLabel}>{m.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.section}>Elevation profile</Text>
        <View style={styles.chartWrap}>
          <ElevationChart points={trip.points} width={chartW} height={chartH} />
        </View>

        <View style={styles.actions}>
          {editing ? (
            <Pressable style={styles.secondaryBtn} onPress={saveTitle}>
              <Text style={styles.secondaryText}>Save title</Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.secondaryBtn}
              onPress={() => setEditing(true)}
            >
              <Text style={styles.secondaryText}>Edit Trip</Text>
            </Pressable>
          )}
          <Pressable
            style={styles.primaryBtn}
            onPress={() =>
              navigation.navigate('ShareDesigner', { tripId: trip.id })
            }
          >
            <Text style={styles.primaryText}>Share</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() =>
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
            ])
          }
        >
          <Text style={styles.delete}>Delete trip</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  headerRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  title: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 28,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  meta: {
    fontFamily: 'SourceSans3_400Regular',
    color: colors.inkMuted,
    marginTop: 4,
  },
  thumb: { width: 64, height: 64, borderRadius: radii.sm },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 22,
    backgroundColor: colors.surface,
    color: colors.ink,
  },
  mapWrap: {
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },
  statCard: {
    width: '48%' as `${number}%`,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: 14,
  },
  statValue: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 20,
    color: colors.ink,
  },
  statLabel: {
    fontFamily: 'SourceSans3_400Regular',
    color: colors.inkMuted,
    marginTop: 4,
    fontSize: 12,
  },
  section: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
    color: colors.ink,
    marginTop: 18,
    marginBottom: 8,
  },
  chartWrap: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: 12,
  },
  actions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  secondaryBtn: {
    flex: 1,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryText: {
    fontFamily: 'Outfit_600SemiBold',
    color: colors.ink,
  },
  primaryBtn: {
    flex: 1,
    borderRadius: radii.pill,
    backgroundColor: colors.ink,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryText: {
    fontFamily: 'Outfit_700Bold',
    color: '#fff',
  },
  delete: {
    textAlign: 'center',
    marginTop: 16,
    fontFamily: 'SourceSans3_600SemiBold',
    color: colors.record,
  },
  missing: {
    padding: spacing.lg,
    fontFamily: 'SourceSans3_400Regular',
  },
});

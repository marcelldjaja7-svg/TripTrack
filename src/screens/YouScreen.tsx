import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTrips } from '../context/TripsContext';
import type { RootStackParamList } from '../types';
import { colors, radii, spacing, typography } from '../theme';
import { formatDistance, formatDuration } from '../utils/format';

export function YouScreen() {
  const { trips } = useTrips();
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList>>();

  const totals = useMemo(() => {
    const distance = trips.reduce((s, t) => s + t.distanceMeters, 0);
    const duration = trips.reduce((s, t) => s + t.durationMs, 0);
    return { distance, duration, count: trips.length };
  }, [trips]);

  const latest = trips[0];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>Y</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>Your profile</Text>
          <Text style={styles.meta}>{totals.count} trips</Text>
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>All-time</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatDistance(totals.distance)}</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatDuration(totals.duration)}</Text>
            <Text style={styles.statLabel}>Time</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{totals.count}</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Share designs</Text>
        <Text style={styles.panelBody}>
          Open any trip and customize a Sunset, Night, Minimal, Postcard, or
          Trail card — then export it to social media.
        </Text>
        {latest ? (
          <Pressable
            style={styles.cta}
            onPress={() =>
              navigation.navigate('ShareDesigner', { tripId: latest.id })
            }
          >
            <Text style={styles.ctaText}>Design latest trip</Text>
          </Pressable>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontFamily: 'Outfit_700Bold',
    fontSize: 28,
  },
  name: { ...typography.title, color: colors.ink },
  meta: { ...typography.caption, marginTop: 4 },
  panel: {
    marginTop: spacing.md,
    marginHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  panelTitle: { ...typography.heading, color: colors.ink },
  panelBody: {
    ...typography.body,
    color: colors.inkMuted,
    marginTop: 8,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  stat: { flex: 1 },
  statValue: { ...typography.metric, fontSize: 20, color: colors.ink },
  statLabel: { ...typography.metricLabel, marginTop: 4 },
  cta: {
    marginTop: spacing.md,
    backgroundColor: colors.primarySoft,
    borderRadius: radii.pill,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ctaText: {
    fontFamily: 'Outfit_600SemiBold',
    color: colors.primaryDark,
    fontSize: 15,
  },
});

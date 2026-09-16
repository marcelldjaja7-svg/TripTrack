import React, { useState } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useTrips } from '../context/TripsContext';
import type { RootStackParamList } from '../types';
import { colors, radii, spacing } from '../theme';
import { formatDistance, formatDurationShort } from '../utils/format';

const TABS = ['Trips', 'Stats', 'Saved', 'Liked'] as const;

export function TripsScreen() {
  const { trips } = useTrips();
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList>>();
  const [tab, setTab] = useState<(typeof TABS)[number]>('Trips');

  const totalDistance = trips.reduce((s, t) => s + t.distanceMeters, 0);
  const totalTime = trips.reduce((s, t) => s + t.durationMs, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
        <Text style={styles.heading}>Your Trips</Text>
        <Text style={styles.sub}>
          {trips.length} journeys · {formatDistance(totalDistance)} ·{' '}
          {formatDurationShort(totalTime)}
        </Text>

        <View style={styles.tabs}>
          {TABS.map((t) => {
            const active = tab === t;
            return (
              <Pressable key={t} onPress={() => setTab(t)} style={styles.tabBtn}>
                <Text style={[styles.tabText, active && styles.tabActive]}>
                  {t}
                </Text>
                {active ? <View style={styles.underline} /> : null}
              </Pressable>
            );
          })}
        </View>

        {tab === 'Stats' ? (
          <View style={styles.statsPanel}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatDistance(totalDistance)}</Text>
              <Text style={styles.statLabel}>Total distance</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {formatDurationShort(totalTime)}
              </Text>
              <Text style={styles.statLabel}>Time on road</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{trips.length}</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
          </View>
        ) : (
          <View style={styles.grid}>
            {trips.map((trip) => (
              <Pressable
                key={trip.id}
                style={styles.card}
                onPress={() =>
                  navigation.navigate('TripDetail', { tripId: trip.id })
                }
              >
                <ImageBackground
                  source={{ uri: trip.coverUri }}
                  style={styles.cardImage}
                  imageStyle={{ borderRadius: radii.md }}
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(8,12,18,0.78)']}
                    style={styles.cardFade}
                  >
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {trip.title}
                    </Text>
                    <Text style={styles.cardMeta}>
                      {formatDistance(trip.distanceMeters)}
                    </Text>
                  </LinearGradient>
                </ImageBackground>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  heading: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 28,
    color: colors.ink,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  sub: {
    fontFamily: 'SourceSans3_400Regular',
    color: colors.inkMuted,
    paddingHorizontal: spacing.md,
    marginTop: 4,
    marginBottom: 8,
  },
  tabs: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    marginBottom: 14,
  },
  tabBtn: { paddingVertical: 12 },
  tabText: {
    fontFamily: 'SourceSans3_600SemiBold',
    color: colors.inkFaint,
  },
  tabActive: { color: colors.ink },
  underline: {
    height: 2,
    backgroundColor: colors.ink,
    marginTop: 8,
    borderRadius: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: spacing.md,
  },
  card: { width: '48%' as `${number}%` },
  cardImage: { height: 170, justifyContent: 'flex-end' },
  cardFade: {
    padding: 12,
    borderBottomLeftRadius: radii.md,
    borderBottomRightRadius: radii.md,
  },
  cardTitle: {
    fontFamily: 'Outfit_700Bold',
    color: '#fff',
    fontSize: 15,
  },
  cardMeta: {
    fontFamily: 'SourceSans3_400Regular',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
    fontSize: 12,
  },
  statsPanel: {
    paddingHorizontal: spacing.md,
    gap: 10,
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: 16,
  },
  statValue: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 24,
    color: colors.ink,
  },
  statLabel: {
    fontFamily: 'SourceSans3_400Regular',
    color: colors.inkMuted,
    marginTop: 4,
  },
});

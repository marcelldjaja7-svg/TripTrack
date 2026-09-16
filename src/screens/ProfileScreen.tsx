import React, { useState } from 'react';
import {
  Image,
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
import { media } from '../storage/trips';
import type { RootStackParamList } from '../types';
import { colors, radii, spacing } from '../theme';
import { formatDistance } from '../utils/format';

const TABS = ['Trips', 'Stats', 'Saved', 'Liked'] as const;

export function ProfileScreen() {
  const { trips } = useTrips();
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList>>();
  const [tab, setTab] = useState<(typeof TABS)[number]>('Trips');
  const latest = trips[0];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView>
        <ImageBackground source={{ uri: media.ocean }} style={styles.cover}>
          <LinearGradient
            colors={['transparent', colors.canvas]}
            style={styles.coverFade}
          />
        </ImageBackground>

        <View style={styles.profileBlock}>
          <Image source={{ uri: media.bali }} style={styles.avatar} />
          <Text style={styles.name}>Marcell Djaja</Text>
          <Text style={styles.handle}>@marcelldjaja</Text>
          <Text style={styles.bio}>
            Collecting roads, coastlines, and stories. Motorcycle-first.
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{trips.length || 48}</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>2.1K</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>624</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          <View style={styles.profileActions}>
            <Pressable style={styles.editBtn}>
              <Text style={styles.editText}>Edit profile</Text>
            </Pressable>
            {latest ? (
              <Pressable
                style={styles.shareBtn}
                onPress={() =>
                  navigation.navigate('ShareDesigner', { tripId: latest.id })
                }
              >
                <Text style={styles.shareText}>Share trip</Text>
              </Pressable>
            ) : null}
          </View>
        </View>

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
                  colors={['transparent', 'rgba(8,12,18,0.75)']}
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  cover: { height: 160 },
  coverFade: { flex: 1 },
  profileBlock: {
    alignItems: 'center',
    marginTop: -42,
    paddingHorizontal: spacing.md,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: colors.canvas,
  },
  name: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 24,
    color: colors.ink,
    marginTop: 10,
  },
  handle: {
    fontFamily: 'SourceSans3_400Regular',
    color: colors.inkMuted,
    marginTop: 2,
  },
  bio: {
    fontFamily: 'SourceSans3_400Regular',
    color: colors.ink,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
    maxWidth: 300,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 28,
  },
  stat: { alignItems: 'center' },
  statValue: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: colors.ink,
  },
  statLabel: {
    fontFamily: 'SourceSans3_400Regular',
    color: colors.inkMuted,
    fontSize: 12,
  },
  profileActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    width: '100%',
  },
  editBtn: {
    flex: 1,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: 12,
    alignItems: 'center',
  },
  editText: {
    fontFamily: 'Outfit_600SemiBold',
    color: colors.ink,
  },
  shareBtn: {
    flex: 1,
    borderRadius: radii.pill,
    backgroundColor: colors.ink,
    paddingVertical: 12,
    alignItems: 'center',
  },
  shareText: {
    fontFamily: 'Outfit_700Bold',
    color: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: spacing.md,
    marginTop: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
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
    padding: spacing.md,
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
    fontSize: 14,
  },
  cardMeta: {
    fontFamily: 'SourceSans3_400Regular',
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
});

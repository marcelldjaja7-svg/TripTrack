import React, { useState } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useTrips } from '../context/TripsContext';
import type { RootStackParamList } from '../types';
import { colors, radii, spacing } from '../theme';
import { formatDistance } from '../utils/format';
import { RoutePreview } from '../components/RoutePreview';

const TABS = ['Your Trips', 'Global', 'Nearby'] as const;

const FEATURED = [
  {
    id: 'amalfi',
    title: 'Amalfi Coast',
    country: 'Italy',
    distance: '118 km',
    image:
      'https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=700&q=80',
  },
  {
    id: 'ocean',
    title: 'Great Ocean Road',
    country: 'Australia',
    distance: '243 km',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80',
  },
  {
    id: 'desert',
    title: 'Atlas Traverse',
    country: 'Morocco',
    distance: '96 km',
    image:
      'https://images.unsplash.com/photo-1509316785289-025f5c846bdf?w=700&q=80',
  },
];

export function ExploreScreen() {
  const { trips } = useTrips();
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList>>();
  const [tab, setTab] = useState<(typeof TABS)[number]>('Global');
  const { width } = useWindowDimensions();
  const mapH = Math.round(width * 0.72);
  const routeTrip = trips[0];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={colors.inkMuted} />
          <TextInput
            style={styles.search}
            placeholder="Search locations, cities, countries..."
            placeholderTextColor={colors.inkFaint}
          />
        </View>

        <View style={styles.tabs}>
          {TABS.map((t) => {
            const active = t === tab;
            return (
              <Pressable
                key={t}
                onPress={() => setTab(t)}
                style={[styles.tab, active && styles.tabActive]}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {t}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.mapCard}>
          <LinearGradient colors={['#DBEAFE', '#EFF6FF', '#F8FAFC']} style={{ height: mapH }}>
            {routeTrip ? (
              <RoutePreview
                points={routeTrip.points}
                width={width - spacing.md * 2}
                height={mapH}
                stroke={colors.route}
                background="transparent"
                glow
              />
            ) : null}
            <View style={styles.pin}>
              <Text style={styles.pinText}>Bali</Text>
            </View>
            <View style={[styles.pin, { top: '58%', left: '62%' }]}>
              <Text style={styles.pinText}>Kyoto</Text>
            </View>
          </LinearGradient>
        </View>

        <Text style={styles.section}>Featured Routes</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.featuredRow}>
            {FEATURED.map((f) => (
              <Pressable
                key={f.id}
                style={styles.featuredCard}
                onPress={() => {
                  if (trips[0]) {
                    navigation.navigate('TripDetail', { tripId: trips[0].id });
                  }
                }}
              >
                <ImageBackground
                  source={{ uri: f.image }}
                  style={styles.featuredImage}
                  imageStyle={{ borderRadius: radii.md }}
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(8,12,18,0.75)']}
                    style={styles.featuredFade}
                  >
                    <Text style={styles.featuredTitle}>{f.title}</Text>
                    <Text style={styles.featuredMeta}>
                      {f.country} · {f.distance}
                    </Text>
                  </LinearGradient>
                </ImageBackground>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <Text style={styles.section}>Your recent pins</Text>
        {trips.slice(0, 3).map((t) => (
          <Pressable
            key={t.id}
            style={styles.recentRow}
            onPress={() => navigation.navigate('TripDetail', { tripId: t.id })}
          >
            <View style={styles.recentDot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.recentTitle}>{t.title}</Text>
              <Text style={styles.recentMeta}>
                {t.locationLabel} · {formatDistance(t.distanceMeters)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.inkFaint} />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  searchWrap: {
    margin: spacing.md,
    marginBottom: 8,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  search: {
    flex: 1,
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 15,
    color: colors.ink,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: spacing.md,
    marginBottom: 12,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
  },
  tabActive: { backgroundColor: colors.ink },
  tabText: {
    fontFamily: 'SourceSans3_600SemiBold',
    color: colors.inkMuted,
  },
  tabTextActive: { color: '#fff' },
  mapCard: {
    marginHorizontal: spacing.md,
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  pin: {
    position: 'absolute',
    top: '32%',
    left: '28%',
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  pinText: {
    fontFamily: 'SourceSans3_600SemiBold',
    fontSize: 12,
    color: colors.ink,
  },
  section: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: colors.ink,
    marginTop: 20,
    marginBottom: 12,
    paddingHorizontal: spacing.md,
  },
  featuredRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: spacing.md,
  },
  featuredCard: { width: 210 },
  featuredImage: { height: 140, justifyContent: 'flex-end' },
  featuredFade: {
    padding: 12,
    borderBottomLeftRadius: radii.md,
    borderBottomRightRadius: radii.md,
  },
  featuredTitle: {
    fontFamily: 'Outfit_700Bold',
    color: '#fff',
    fontSize: 16,
  },
  featuredMeta: {
    fontFamily: 'SourceSans3_400Regular',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
    fontSize: 12,
  },
  recentRow: {
    marginHorizontal: spacing.md,
    marginBottom: 8,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.route,
  },
  recentTitle: {
    fontFamily: 'Outfit_600SemiBold',
    color: colors.ink,
  },
  recentMeta: {
    fontFamily: 'SourceSans3_400Regular',
    color: colors.inkMuted,
    marginTop: 2,
    fontSize: 12,
  },
});

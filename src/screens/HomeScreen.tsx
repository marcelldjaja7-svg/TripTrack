import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FeedPostCard } from '../components/FeedPostCard';
import { useTrips } from '../context/TripsContext';
import type { RootStackParamList } from '../types';
import { colors, spacing } from '../theme';

const FEED_TABS = ['For You', 'Following', 'Nearby'] as const;

export function HomeScreen() {
  const { trips } = useTrips();
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList>>();
  const [tab, setTab] = useState<(typeof FEED_TABS)[number]>('For You');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.top}>
        <Text style={styles.brand}>Triply</Text>
        <View style={styles.topActions}>
          <Ionicons name="notifications-outline" size={22} color={colors.ink} />
        </View>
      </View>

      <View style={styles.tabs}>
        {FEED_TABS.map((t) => {
          const active = t === tab;
          return (
            <Pressable key={t} onPress={() => setTab(t)} style={styles.tabBtn}>
              <Text style={[styles.tabText, active && styles.tabActive]}>{t}</Text>
              {active ? <View style={styles.tabUnderline} /> : null}
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FeedPostCard
            trip={item}
            onPress={() =>
              navigation.navigate('TripDetail', { tripId: item.id })
            }
            onShare={() =>
              navigation.navigate('ShareDesigner', { tripId: item.id })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  top: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 28,
    color: colors.ink,
    letterSpacing: -0.6,
  },
  topActions: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  tabBtn: { paddingVertical: 12 },
  tabText: {
    fontFamily: 'SourceSans3_600SemiBold',
    color: colors.inkFaint,
    fontSize: 15,
  },
  tabActive: { color: colors.ink },
  tabUnderline: {
    height: 2,
    backgroundColor: colors.ink,
    marginTop: 8,
    borderRadius: 2,
  },
});

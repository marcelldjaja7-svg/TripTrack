import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TripFeedCard } from '../components/TripFeedCard';
import { useTrips } from '../context/TripsContext';
import type { RootStackParamList } from '../types';
import { colors, spacing, typography } from '../theme';

export function HomeScreen() {
  const { trips, loading } = useTrips();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Text style={styles.brand}>TripTrack</Text>
        <Text style={styles.tagline}>Your trips, share-ready</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          contentContainerStyle={trips.length ? undefined : styles.emptyPad}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyTitle}>No trips yet</Text>
              <Text style={styles.emptyBody}>
                Hit Record to track distance, speed, and your route.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TripFeedCard
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
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  topBar: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  brand: {
    ...typography.brand,
    color: colors.primary,
  },
  tagline: {
    ...typography.caption,
    marginTop: 2,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  emptyPad: {
    flexGrow: 1,
  },
  emptyTitle: {
    ...typography.heading,
    color: colors.ink,
  },
  emptyBody: {
    ...typography.body,
    color: colors.inkMuted,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 280,
  },
});

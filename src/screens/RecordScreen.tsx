import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { RoutePreview } from '../components/RoutePreview';
import { useTrips } from '../context/TripsContext';
import { useTripTracker } from '../hooks/useTripTracker';
import type { RootStackParamList } from '../types';
import { colors, radii, spacing } from '../theme';
import {
  formatDistance,
  formatDuration,
  formatElevation,
  formatSpeed,
} from '../utils/format';

export function RecordScreen() {
  const tracker = useTripTracker();
  const { addTrip } = useTrips();
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList>>();
  const { width, height } = useWindowDimensions();
  const [saving, setSaving] = useState(false);
  const pulse = useRef(new Animated.Value(1)).current;
  const isLive = tracker.status === 'recording' || tracker.status === 'paused';

  useEffect(() => {
    if (tracker.status !== 'recording') {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [tracker.status, pulse]);

  const onStop = async () => {
    setSaving(true);
    const trip = tracker.stop();
    setSaving(false);
    if (!trip) {
      Alert.alert('Trip too short', 'Keep moving a bit longer to capture a route.');
      return;
    }
    await addTrip(trip);
    navigation.navigate('TripDetail', { tripId: trip.id });
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <LinearGradient colors={['#0B1220', '#111827', '#0B0F14']} style={styles.mapBg}>
        <RoutePreview
          points={tracker.stats.points}
          width={width}
          height={height}
          stroke={colors.routeGlow}
          background="#0F172A"
          glow
        />
      </LinearGradient>

      <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
        <View style={styles.topCard}>
          <View style={styles.liveRow}>
            <Animated.View style={[styles.liveDot, { opacity: pulse }]} />
            <Text style={styles.liveText}>
              {tracker.status === 'paused'
                ? 'Paused'
                : isLive
                  ? 'Recording Trip'
                  : 'Ready to record'}
            </Text>
          </View>
          <Text style={styles.timer}>
            {formatDuration(tracker.stats.durationMs)}
          </Text>
        </View>

        <View style={styles.metricsBar}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>
              {formatDistance(tracker.stats.distanceMeters)}
            </Text>
            <Text style={styles.metricLabel}>Distance</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>
              {formatSpeed(tracker.stats.currentSpeedMps)}
            </Text>
            <Text style={styles.metricLabel}>Speed</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>
              {formatElevation(tracker.stats.elevationMeters)}
            </Text>
            <Text style={styles.metricLabel}>Elevation</Text>
          </View>
        </View>

        <View style={styles.sideActions}>
          <View style={styles.fab}>
            <Ionicons name="layers-outline" size={18} color="#fff" />
          </View>
          <View style={styles.fab}>
            <Ionicons name="navigate-outline" size={18} color="#fff" />
          </View>
          <View style={styles.fab}>
            <Ionicons name="camera-outline" size={18} color="#fff" />
          </View>
        </View>

        <View style={{ flex: 1 }} />

        {tracker.usingSimulation ? (
          <Text style={styles.demoHint}>Demo GPS path · web preview</Text>
        ) : null}

        <View style={styles.controls}>
          {!isLive ? (
            <Pressable style={styles.startBtn} onPress={tracker.start}>
              <Text style={styles.startText}>Start Trip</Text>
            </Pressable>
          ) : (
            <>
              <View style={styles.lockBtn}>
                <Ionicons name="lock-closed-outline" size={20} color="#fff" />
              </View>
              <Pressable
                style={styles.pauseBtn}
                onPress={
                  tracker.status === 'paused' ? tracker.resume : tracker.pause
                }
              >
                <Ionicons
                  name={tracker.status === 'paused' ? 'play' : 'pause'}
                  size={28}
                  color="#fff"
                />
              </Pressable>
              <Pressable
                style={[styles.finishBtn, saving && { opacity: 0.6 }]}
                onPress={onStop}
                disabled={saving}
              >
                <Text style={styles.finishText}>
                  {saving ? 'Saving…' : 'Finish'}
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.dark },
  mapBg: { ...StyleSheet.absoluteFill },
  overlay: { flex: 1, paddingHorizontal: spacing.md },
  topCard: {
    marginTop: spacing.sm,
    backgroundColor: colors.darkPanel,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.record,
  },
  liveText: {
    fontFamily: 'SourceSans3_600SemiBold',
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
  },
  timer: {
    fontFamily: 'Outfit_700Bold',
    color: '#fff',
    fontSize: 42,
    letterSpacing: -1,
    marginTop: 6,
  },
  metricsBar: {
    marginTop: 12,
    backgroundColor: colors.darkPanel,
    borderRadius: radii.md,
    paddingVertical: 14,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  metric: { flex: 1, alignItems: 'center' },
  metricValue: {
    fontFamily: 'Outfit_700Bold',
    color: '#fff',
    fontSize: 18,
  },
  metricLabel: {
    fontFamily: 'SourceSans3_400Regular',
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  sideActions: {
    position: 'absolute',
    right: spacing.md,
    top: 210,
    gap: 10,
  },
  fab: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(15,23,42,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoHint: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.55)',
    fontFamily: 'SourceSans3_400Regular',
    marginBottom: 8,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingBottom: spacing.md,
  },
  startBtn: {
    flex: 1,
    backgroundColor: colors.record,
    borderRadius: radii.pill,
    paddingVertical: 18,
    alignItems: 'center',
  },
  startText: {
    fontFamily: 'Outfit_700Bold',
    color: '#fff',
    fontSize: 17,
  },
  lockBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.record,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishBtn: {
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  finishText: {
    fontFamily: 'Outfit_700Bold',
    color: '#fff',
    fontSize: 15,
  },
});

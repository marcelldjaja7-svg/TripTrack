import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import type { GeoPoint, Trip } from '../types';
import { createSimulatedRoute, pathDistanceMeters } from '../utils/geo';
import { defaultTripTitle } from '../utils/format';

export type TrackerStatus = 'idle' | 'recording' | 'paused';

type LiveStats = {
  distanceMeters: number;
  durationMs: number;
  currentSpeedMps: number;
  avgSpeedMps: number;
  maxSpeedMps: number;
  points: GeoPoint[];
};

const emptyStats: LiveStats = {
  distanceMeters: 0,
  durationMs: 0,
  currentSpeedMps: 0,
  avgSpeedMps: 0,
  maxSpeedMps: 0,
  points: [],
};

function newId() {
  return `trip-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useTripTracker() {
  const [status, setStatus] = useState<TrackerStatus>('idle');
  const [stats, setStats] = useState<LiveStats>(emptyStats);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [usingSimulation, setUsingSimulation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startedAtRef = useRef<number | null>(null);
  const pausedAccumRef = useRef(0);
  const pauseStartedRef = useRef<number | null>(null);
  const pointsRef = useRef<GeoPoint[]>([]);
  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const simOriginRef = useRef({ latitude: 34.0522, longitude: -118.2437 });
  const maxSpeedRef = useRef(0);

  const clearTimers = useCallback(() => {
    if (watchRef.current) {
      watchRef.current.remove();
      watchRef.current = null;
    }
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const recompute = useCallback((points: GeoPoint[], now: number) => {
    const startedAt = startedAtRef.current ?? now;
    const pausedExtra =
      pauseStartedRef.current != null ? now - pauseStartedRef.current : 0;
    const durationMs = Math.max(
      0,
      now - startedAt - pausedAccumRef.current - pausedExtra,
    );
    const distanceMeters = pathDistanceMeters(points);
    const avgSpeedMps =
      durationMs > 0 ? distanceMeters / (durationMs / 1000) : 0;
    const last = points[points.length - 1];
    const currentSpeedMps = last?.speed && last.speed > 0 ? last.speed : avgSpeedMps;
    if (currentSpeedMps > maxSpeedRef.current) {
      maxSpeedRef.current = currentSpeedMps;
    }
    setStats({
      distanceMeters,
      durationMs,
      currentSpeedMps,
      avgSpeedMps,
      maxSpeedMps: maxSpeedRef.current,
      points: [...points],
    });
  }, []);

  const pushPoint = useCallback(
    (point: GeoPoint) => {
      const prev = pointsRef.current[pointsRef.current.length - 1];
      if (prev) {
        const dt = point.timestamp - prev.timestamp;
        if (dt < 800) return;
        const dist = pathDistanceMeters([prev, point]);
        // Ignore GPS jumps > 80m in under 2s while still allowing highway speeds
        if (dt < 2000 && dist > 120) return;
      }
      pointsRef.current = [...pointsRef.current, point];
      recompute(pointsRef.current, Date.now());
    },
    [recompute],
  );

  const startSimulation = useCallback(() => {
    setUsingSimulation(true);
    tickRef.current = setInterval(() => {
      if (!startedAtRef.current || pauseStartedRef.current != null) return;
      const elapsed =
        Date.now() -
        startedAtRef.current -
        pausedAccumRef.current;
      const route = createSimulatedRoute(
        simOriginRef.current,
        startedAtRef.current,
        elapsed,
      );
      pointsRef.current = route;
      recompute(route, Date.now());
    }, 1000);
  }, [recompute]);

  const startGpsWatch = useCallback(async () => {
    watchRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 3,
      },
      (loc) => {
        if (pauseStartedRef.current != null) return;
        pushPoint({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          timestamp: loc.timestamp,
          speed: loc.coords.speed != null && loc.coords.speed >= 0 ? loc.coords.speed : null,
          altitude: loc.coords.altitude,
        });
      },
    );
    // Duration ticker even when GPS is quiet
    tickRef.current = setInterval(() => {
      if (pauseStartedRef.current != null) return;
      recompute(pointsRef.current, Date.now());
    }, 1000);
  }, [pushPoint, recompute]);

  const start = useCallback(async () => {
    setError(null);
    clearTimers();
    pointsRef.current = [];
    maxSpeedRef.current = 0;
    pausedAccumRef.current = 0;
    pauseStartedRef.current = null;
    startedAtRef.current = Date.now();
    setStats(emptyStats);
    setStatus('recording');

    try {
      const { status: perm } = await Location.requestForegroundPermissionsAsync();
      if (perm !== 'granted') {
        setPermissionDenied(true);
        // Fall back to simulation so the MVP is demoable on web / denied GPS
        startSimulation();
        return;
      }
      setPermissionDenied(false);

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      simOriginRef.current = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      };
      pushPoint({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        timestamp: current.timestamp,
        speed: current.coords.speed,
        altitude: current.coords.altitude,
      });

      // Web browsers often throttle watchPosition; use simulation on web for reliable demos
      if (Platform.OS === 'web') {
        startSimulation();
      } else {
        setUsingSimulation(false);
        await startGpsWatch();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to start location');
      startSimulation();
    }
  }, [clearTimers, pushPoint, startGpsWatch, startSimulation]);

  const pause = useCallback(() => {
    if (status !== 'recording') return;
    pauseStartedRef.current = Date.now();
    setStatus('paused');
  }, [status]);

  const resume = useCallback(() => {
    if (status !== 'paused' || pauseStartedRef.current == null) return;
    pausedAccumRef.current += Date.now() - pauseStartedRef.current;
    pauseStartedRef.current = null;
    setStatus('recording');
  }, [status]);

  const stop = useCallback((): Trip | null => {
    clearTimers();
    const startedAt = startedAtRef.current;
    const points = pointsRef.current;
    setStatus('idle');
    if (!startedAt || points.length < 2) {
      startedAtRef.current = null;
      pointsRef.current = [];
      setStats(emptyStats);
      return null;
    }
    const endedAt = Date.now();
    const durationMs = Math.max(
      1000,
      endedAt - startedAt - pausedAccumRef.current,
    );
    const distanceMeters = pathDistanceMeters(points);
    const avgSpeedMps = distanceMeters / (durationMs / 1000);
    const trip: Trip = {
      id: newId(),
      title: defaultTripTitle(startedAt),
      startedAt,
      endedAt,
      durationMs,
      distanceMeters,
      avgSpeedMps,
      maxSpeedMps: Math.max(maxSpeedRef.current, avgSpeedMps),
      points,
    };
    startedAtRef.current = null;
    pauseStartedRef.current = null;
    pausedAccumRef.current = 0;
    pointsRef.current = [];
    maxSpeedRef.current = 0;
    setStats(emptyStats);
    setUsingSimulation(false);
    return trip;
  }, [clearTimers]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return {
    status,
    stats,
    permissionDenied,
    usingSimulation,
    error,
    start,
    pause,
    resume,
    stop,
  };
}

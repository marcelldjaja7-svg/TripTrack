import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Trip } from '../types';
import { createSimulatedRoute } from '../utils/geo';
import { pathDistanceMeters } from '../utils/geo';

const TRIPS_KEY = 'triptrack.trips.v1';

function sampleTrips(): Trip[] {
  const now = Date.now();
  const mk = (
    id: string,
    title: string,
    hoursAgo: number,
    durationMin: number,
    locationLabel: string,
    start: { latitude: number; longitude: number },
  ): Trip => {
    const startedAt = now - hoursAgo * 3600_000;
    const durationMs = durationMin * 60_000;
    const points = createSimulatedRoute(start, startedAt, durationMs);
    const distanceMeters = pathDistanceMeters(points);
    const avgSpeedMps = distanceMeters / (durationMs / 1000);
    const maxSpeedMps = Math.max(...points.map((p) => p.speed ?? 0), avgSpeedMps);
    return {
      id,
      title,
      startedAt,
      endedAt: startedAt + durationMs,
      durationMs,
      distanceMeters,
      avgSpeedMps,
      maxSpeedMps,
      points,
      locationLabel,
    };
  };

  return [
    mk('sample-1', 'Coastal loop', 5, 48, 'Santa Monica, CA', {
      latitude: 34.0195,
      longitude: -118.4912,
    }),
    mk('sample-2', 'Weekend getaway', 28, 95, 'Big Sur, CA', {
      latitude: 36.2704,
      longitude: -121.8081,
    }),
    mk('sample-3', 'City wander', 52, 36, 'Downtown LA', {
      latitude: 34.0522,
      longitude: -118.2437,
    }),
  ];
}

export async function loadTrips(): Promise<Trip[]> {
  try {
    const raw = await AsyncStorage.getItem(TRIPS_KEY);
    if (!raw) {
      const seeded = sampleTrips();
      await AsyncStorage.setItem(TRIPS_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw) as Trip[];
  } catch {
    return sampleTrips();
  }
}

export async function saveTrips(trips: Trip[]): Promise<void> {
  await AsyncStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
}

export async function upsertTrip(trip: Trip): Promise<Trip[]> {
  const trips = await loadTrips();
  const idx = trips.findIndex((t) => t.id === trip.id);
  const next =
    idx >= 0
      ? trips.map((t, i) => (i === idx ? trip : t))
      : [trip, ...trips];
  await saveTrips(next);
  return next;
}

export async function deleteTrip(tripId: string): Promise<Trip[]> {
  const trips = await loadTrips();
  const next = trips.filter((t) => t.id !== tripId);
  await saveTrips(next);
  return next;
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Trip } from '../types';
import {
  createSimulatedRoute,
  elevationGainMeters,
  pathDistanceMeters,
} from '../utils/geo';
import { estimateCalories } from '../utils/format';

const TRIPS_KEY = 'triply.trips.v1';

const COVERS = {
  bali: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=900&q=80',
  japan: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&q=80',
  amalfi: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=900&q=80',
  ocean: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
  desert: 'https://images.unsplash.com/photo-1509316785289-025f5c846bdf?w=900&q=80',
  onboarding:
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=80',
};

export const media = COVERS;

function sampleTrips(): Trip[] {
  const now = Date.now();
  const mk = (
    id: string,
    title: string,
    hoursAgo: number,
    durationMin: number,
    locationLabel: string,
    mode: Trip['mode'],
    coverUri: string,
    start: { latitude: number; longitude: number },
    likes: number,
    comments: number,
    caption: string,
  ): Trip => {
    const startedAt = now - hoursAgo * 3600_000;
    const durationMs = durationMin * 60_000;
    const points = createSimulatedRoute(start, startedAt, durationMs, {
      stepMs: 20_000,
      speedMps: mode === 'Walk' ? 1.4 : mode === 'Bike' ? 5 : 12,
    });
    const distanceMeters = pathDistanceMeters(points);
    const avgSpeedMps = distanceMeters / (durationMs / 1000);
    const maxSpeedMps = Math.max(
      ...points.map((p) => p.speed ?? 0),
      avgSpeedMps,
    );
    return {
      id,
      title,
      startedAt,
      endedAt: startedAt + durationMs,
      durationMs,
      distanceMeters,
      avgSpeedMps,
      maxSpeedMps,
      elevationGainMeters: elevationGainMeters(points) || durationMin * 8,
      calories: estimateCalories(distanceMeters, durationMs),
      mode,
      points,
      locationLabel,
      coverUri,
      likes,
      comments,
      caption,
    };
  };

  return [
    mk(
      'sample-bali',
      'Bali Loop',
      8,
      252,
      'Bali, Indonesia',
      'Motorcycle',
      COVERS.bali,
      { latitude: -8.4095, longitude: 115.1889 },
      128,
      12,
      'Coast roads, temples, and endless turns. #bali #motorcycle #triply',
    ),
    mk(
      'sample-japan',
      'Japan Road Trip',
      80,
      480,
      'Kyoto, Japan',
      'Drive',
      COVERS.japan,
      { latitude: 35.0116, longitude: 135.7681 },
      86,
      9,
      'Cherry season wander through mountain towns.',
    ),
    mk(
      'sample-amalfi',
      'Amalfi Coast',
      200,
      190,
      'Amalfi, Italy',
      'Drive',
      COVERS.amalfi,
      { latitude: 40.634, longitude: 14.6027 },
      210,
      24,
      'Cliffs, lemon groves, and blue water.',
    ),
    mk(
      'sample-ocean',
      'Great Ocean Road',
      360,
      320,
      'Victoria, Australia',
      'Drive',
      COVERS.ocean,
      { latitude: -38.668, longitude: 143.106 },
      64,
      5,
      'Stacks, surf, and golden light.',
    ),
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
    idx >= 0 ? trips.map((t, i) => (i === idx ? trip : t)) : [trip, ...trips];
  await saveTrips(next);
  return next;
}

export async function deleteTrip(tripId: string): Promise<Trip[]> {
  const trips = await loadTrips();
  const next = trips.filter((t) => t.id !== tripId);
  await saveTrips(next);
  return next;
}

export async function loadOnboarded(): Promise<boolean> {
  return (await AsyncStorage.getItem('triply.onboarded')) === '1';
}

export async function setOnboarded(): Promise<void> {
  await AsyncStorage.setItem('triply.onboarded', '1');
}

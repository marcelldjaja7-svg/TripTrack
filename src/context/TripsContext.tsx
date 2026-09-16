import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Trip } from '../types';
import {
  deleteTrip,
  loadOnboarded,
  loadTrips,
  setOnboarded,
  upsertTrip,
} from '../storage/trips';

type TripsContextValue = {
  trips: Trip[];
  loading: boolean;
  onboarded: boolean;
  refresh: () => Promise<void>;
  addTrip: (trip: Trip) => Promise<void>;
  updateTrip: (trip: Trip) => Promise<void>;
  removeTrip: (tripId: string) => Promise<void>;
  getTrip: (tripId: string) => Trip | undefined;
  completeOnboarding: () => Promise<void>;
};

const TripsContext = createContext<TripsContextValue | null>(null);

export function TripsProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [onboarded, setOnboardedState] = useState(false);

  const refresh = useCallback(async () => {
    const [data, done] = await Promise.all([loadTrips(), loadOnboarded()]);
    setTrips(data);
    setOnboardedState(done);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTrip = useCallback(async (trip: Trip) => {
    setTrips(await upsertTrip(trip));
  }, []);

  const updateTrip = useCallback(async (trip: Trip) => {
    setTrips(await upsertTrip(trip));
  }, []);

  const removeTrip = useCallback(async (tripId: string) => {
    setTrips(await deleteTrip(tripId));
  }, []);

  const getTrip = useCallback(
    (tripId: string) => trips.find((t) => t.id === tripId),
    [trips],
  );

  const completeOnboarding = useCallback(async () => {
    await setOnboarded();
    setOnboardedState(true);
  }, []);

  const value = useMemo(
    () => ({
      trips,
      loading,
      onboarded,
      refresh,
      addTrip,
      updateTrip,
      removeTrip,
      getTrip,
      completeOnboarding,
    }),
    [
      trips,
      loading,
      onboarded,
      refresh,
      addTrip,
      updateTrip,
      removeTrip,
      getTrip,
      completeOnboarding,
    ],
  );

  return <TripsContext.Provider value={value}>{children}</TripsContext.Provider>;
}

export function useTrips() {
  const ctx = useContext(TripsContext);
  if (!ctx) throw new Error('useTrips must be used within TripsProvider');
  return ctx;
}

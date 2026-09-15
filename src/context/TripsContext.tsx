import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Trip } from '../types';
import { deleteTrip, loadTrips, upsertTrip } from '../storage/trips';

type TripsContextValue = {
  trips: Trip[];
  loading: boolean;
  refresh: () => Promise<void>;
  addTrip: (trip: Trip) => Promise<void>;
  updateTrip: (trip: Trip) => Promise<void>;
  removeTrip: (tripId: string) => Promise<void>;
  getTrip: (tripId: string) => Trip | undefined;
};

const TripsContext = createContext<TripsContextValue | null>(null);

export function TripsProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await loadTrips();
    setTrips(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTrip = useCallback(async (trip: Trip) => {
    const next = await upsertTrip(trip);
    setTrips(next);
  }, []);

  const updateTrip = useCallback(async (trip: Trip) => {
    const next = await upsertTrip(trip);
    setTrips(next);
  }, []);

  const removeTrip = useCallback(async (tripId: string) => {
    const next = await deleteTrip(tripId);
    setTrips(next);
  }, []);

  const getTrip = useCallback(
    (tripId: string) => trips.find((t) => t.id === tripId),
    [trips],
  );

  const value = useMemo(
    () => ({
      trips,
      loading,
      refresh,
      addTrip,
      updateTrip,
      removeTrip,
      getTrip,
    }),
    [trips, loading, refresh, addTrip, updateTrip, removeTrip, getTrip],
  );

  return <TripsContext.Provider value={value}>{children}</TripsContext.Provider>;
}

export function useTrips() {
  const ctx = useContext(TripsContext);
  if (!ctx) throw new Error('useTrips must be used within TripsProvider');
  return ctx;
}

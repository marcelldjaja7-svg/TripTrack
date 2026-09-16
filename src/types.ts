export type GeoPoint = {
  latitude: number;
  longitude: number;
  timestamp: number;
  speed?: number | null;
  altitude?: number | null;
};

export type TripMode = 'Motorcycle' | 'Drive' | 'Walk' | 'Bike' | 'Other';

export type Trip = {
  id: string;
  title: string;
  startedAt: number;
  endedAt: number;
  durationMs: number;
  distanceMeters: number;
  avgSpeedMps: number;
  maxSpeedMps: number;
  elevationGainMeters: number;
  calories: number;
  mode: TripMode;
  points: GeoPoint[];
  locationLabel?: string;
  coverUri?: string;
  caption?: string;
  likes?: number;
  comments?: number;
};

export type ShareTemplateId =
  | 'story'
  | 'minimal'
  | 'photo'
  | 'map'
  | 'stats'
  | 'quote';

export type ShareDesign = {
  templateId: ShareTemplateId;
  title: string;
  subtitle: string;
  accentColor: string;
  showDistance: boolean;
  showDuration: boolean;
  showElevation: boolean;
  showRoute: boolean;
};

export type RootStackParamList = {
  Onboarding: undefined;
  Tabs: undefined;
  TripDetail: { tripId: string };
  ShareDesigner: { tripId: string };
  RecordModal: undefined;
};

export type TabParamList = {
  Home: undefined;
  Explore: undefined;
  Record: undefined;
  Trips: undefined;
  Profile: undefined;
};

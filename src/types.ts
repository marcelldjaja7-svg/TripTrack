export type GeoPoint = {
  latitude: number;
  longitude: number;
  timestamp: number;
  speed?: number | null;
  altitude?: number | null;
};

export type Trip = {
  id: string;
  title: string;
  startedAt: number;
  endedAt: number;
  durationMs: number;
  distanceMeters: number;
  avgSpeedMps: number;
  maxSpeedMps: number;
  points: GeoPoint[];
  locationLabel?: string;
};

export type ShareTemplateId =
  | 'sunset'
  | 'night'
  | 'minimal'
  | 'postcard'
  | 'trail';

export type ShareDesign = {
  templateId: ShareTemplateId;
  title: string;
  subtitle: string;
  accentColor: string;
  showDistance: boolean;
  showDuration: boolean;
  showAvgSpeed: boolean;
  showRoute: boolean;
};

export type RootStackParamList = {
  Tabs: undefined;
  TripDetail: { tripId: string };
  ShareDesigner: { tripId: string };
};

export type TabParamList = {
  Home: undefined;
  Record: undefined;
  You: undefined;
};

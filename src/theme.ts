export const colors = {
  primary: '#E85D04',
  primaryDark: '#C44A00',
  primarySoft: '#FFF0E6',
  ink: '#141414',
  inkMuted: '#6B6B6B',
  inkFaint: '#9A9A9A',
  surface: '#FFFFFF',
  canvas: '#F6F4F1',
  border: '#E8E4DE',
  success: '#1F7A4D',
  mapTrack: '#E85D04',
  danger: '#C62828',
  overlay: 'rgba(20,20,20,0.55)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999,
};

export const typography = {
  brand: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 28,
    letterSpacing: -0.5,
  },
  title: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 22,
    letterSpacing: -0.3,
  },
  heading: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 18,
  },
  body: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 15,
  },
  bodyBold: {
    fontFamily: 'SourceSans3_600SemiBold',
    fontSize: 15,
  },
  metric: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 24,
    letterSpacing: -0.4,
  },
  metricLabel: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 12,
    color: colors.inkMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.6,
  },
  caption: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 13,
    color: colors.inkMuted,
  },
};

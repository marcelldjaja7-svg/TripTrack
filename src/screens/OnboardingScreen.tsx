import React from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTrips } from '../context/TripsContext';
import { media } from '../storage/trips';
import { colors, radii, spacing } from '../theme';

export function OnboardingScreen() {
  const { completeOnboarding } = useTrips();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ImageBackground source={{ uri: media.onboarding }} style={styles.bg}>
        <LinearGradient
          colors={['rgba(8,12,18,0.15)', 'rgba(8,12,18,0.82)']}
          style={styles.fade}
        >
          <SafeAreaView style={styles.safe}>
            <View style={styles.brandRow}>
              <View style={styles.logoMark}>
                <Text style={styles.logoPeak}>▲</Text>
              </View>
              <View>
                <Text style={styles.brand}>Triply</Text>
                <Text style={styles.tag}>Track. Relive. Share.</Text>
              </View>
            </View>

            <View style={{ flex: 1 }} />

            <Text style={styles.headline}>
              Turn your trips into{'\n'}lasting stories.
            </Text>

            <Pressable style={styles.cta} onPress={completeOnboarding}>
              <Text style={styles.ctaText}>Get Started</Text>
            </Pressable>
            <Pressable onPress={completeOnboarding} style={styles.secondary}>
              <Text style={styles.secondaryText}>I already have an account</Text>
            </Pressable>

            <View style={styles.dots}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.dark },
  bg: { flex: 1 },
  fade: { flex: 1 },
  safe: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: spacing.md,
  },
  logoMark: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPeak: { color: '#fff', fontSize: 16 },
  brand: {
    fontFamily: 'Outfit_700Bold',
    color: '#fff',
    fontSize: 28,
    letterSpacing: -0.5,
  },
  tag: {
    fontFamily: 'SourceSans3_400Regular',
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  headline: {
    fontFamily: 'Outfit_700Bold',
    color: '#fff',
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.8,
    marginBottom: spacing.lg,
  },
  cta: {
    backgroundColor: '#fff',
    borderRadius: radii.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaText: {
    fontFamily: 'Outfit_700Bold',
    color: colors.ink,
    fontSize: 16,
  },
  secondary: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  secondaryText: {
    fontFamily: 'SourceSans3_600SemiBold',
    color: 'rgba(255,255,255,0.85)',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: {
    width: 18,
    backgroundColor: '#fff',
  },
});

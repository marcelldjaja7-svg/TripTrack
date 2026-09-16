import React from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { Trip } from '../types';
import { colors, radii, spacing } from '../theme';
import {
  formatDistance,
  formatRelative,
} from '../utils/format';

type Props = {
  trip: Trip;
  author?: string;
  onPress?: () => void;
  onShare?: () => void;
};

export function FeedPostCard({
  trip,
  author = 'Marcell Djaja',
  onPress,
  onShare,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {author
              .split(' ')
              .map((p) => p[0])
              .join('')
              .slice(0, 2)}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{author}</Text>
          <Text style={styles.meta}>
            {formatRelative(trip.startedAt)}
            {trip.locationLabel ? ` · ${trip.locationLabel}` : ''}
          </Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={18} color={colors.inkMuted} />
      </View>

      <Pressable onPress={onPress}>
        <ImageBackground
          source={{ uri: trip.coverUri }}
          style={styles.hero}
          imageStyle={{ borderRadius: radii.md }}
        >
          <LinearGradient
            colors={['transparent', 'rgba(8,12,18,0.72)']}
            style={styles.heroFade}
          >
            <Text style={styles.heroTitle}>{trip.title}</Text>
            <Text style={styles.heroDist}>{formatDistance(trip.distanceMeters)}</Text>
          </LinearGradient>
        </ImageBackground>
      </Pressable>

      <Text style={styles.caption} numberOfLines={2}>
        {trip.caption || `Relived with Triply · ${trip.mode}`}
      </Text>

      <View style={styles.actions}>
        <View style={styles.action}>
          <Ionicons name="heart-outline" size={22} color={colors.ink} />
          <Text style={styles.actionText}>{trip.likes ?? 0}</Text>
        </View>
        <View style={styles.action}>
          <Ionicons name="chatbubble-outline" size={21} color={colors.ink} />
          <Text style={styles.actionText}>{trip.comments ?? 0}</Text>
        </View>
        <Pressable style={styles.action} onPress={onShare}>
          <Ionicons name="share-outline" size={22} color={colors.ink} />
        </Pressable>
        <View style={{ flex: 1 }} />
        <Ionicons name="bookmark-outline" size={22} color={colors.ink} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontFamily: 'Outfit_700Bold',
    fontSize: 13,
  },
  name: {
    fontFamily: 'SourceSans3_600SemiBold',
    fontSize: 15,
    color: colors.ink,
  },
  meta: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 12,
    color: colors.inkMuted,
    marginTop: 1,
  },
  hero: {
    marginHorizontal: spacing.md,
    height: 280,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderRadius: radii.md,
  },
  heroFade: {
    padding: 16,
    borderBottomLeftRadius: radii.md,
    borderBottomRightRadius: radii.md,
  },
  heroTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 24,
    color: '#fff',
  },
  heroDist: {
    fontFamily: 'SourceSans3_600SemiBold',
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  caption: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 14,
    color: colors.ink,
    paddingHorizontal: spacing.md,
    marginTop: 12,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: spacing.md,
    marginTop: 12,
  },
  action: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: {
    fontFamily: 'SourceSans3_600SemiBold',
    color: colors.ink,
    fontSize: 13,
  },
});

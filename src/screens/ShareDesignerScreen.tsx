import React, { useRef, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { ShareCardCanvas } from '../components/ShareCardCanvas';
import { useTrips } from '../context/TripsContext';
import type { RootStackParamList, ShareDesign, ShareTemplateId } from '../types';
import { colors, radii, spacing } from '../theme';

type Props = StackScreenProps<RootStackParamList, 'ShareDesigner'>;

const FILTERS = ['All', 'Minimal', 'Photo', 'Map', 'Stats'] as const;

const TEMPLATES: {
  id: ShareTemplateId;
  label: string;
  filter: (typeof FILTERS)[number];
}[] = [
  { id: 'story', label: 'Story', filter: 'Photo' },
  { id: 'photo', label: 'Photo', filter: 'Photo' },
  { id: 'minimal', label: 'Minimal', filter: 'Minimal' },
  { id: 'map', label: 'Map Glow', filter: 'Map' },
  { id: 'stats', label: 'Stats', filter: 'Stats' },
  { id: 'quote', label: 'Quote', filter: 'Minimal' },
];

const ACCENTS = ['#F8FAFC', '#3B82F6', '#E53935', '#F59E0B', '#10B981', '#A78BFA'];

export function ShareDesignerScreen({ route }: Props) {
  const { tripId } = route.params;
  const { getTrip } = useTrips();
  const trip = getTrip(tripId);
  const shotRef = useRef<React.ElementRef<typeof ViewShot>>(null);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const [design, setDesign] = useState<ShareDesign>(() => ({
    templateId: 'story',
    title: trip?.title ?? 'My trip',
    subtitle: trip?.caption ?? 'Collect Trips Not Things.',
    accentColor: '#F8FAFC',
    showDistance: true,
    showDuration: true,
    showElevation: true,
    showRoute: true,
  }));

  const patch = (partial: Partial<ShareDesign>) =>
    setDesign((d) => ({ ...d, ...partial }));

  const visible = TEMPLATES.filter(
    (t) => filter === 'All' || t.filter === filter,
  );

  const exportImage = async () => {
    if (!shotRef.current?.capture) {
      Alert.alert('Export unavailable', 'Could not capture the share card.');
      return;
    }
    try {
      setBusy(true);
      const uri = await shotRef.current.capture();
      if (Platform.OS === 'web') {
        const a = document.createElement('a');
        a.href = uri;
        a.download = `triply-${tripId}.png`;
        a.click();
        Alert.alert('Downloaded', 'Story image saved.');
      } else if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Share your trip',
        });
      } else {
        Alert.alert('Saved', uri);
      }
    } catch (e) {
      Alert.alert(
        'Share failed',
        e instanceof Error ? e.message : 'Unable to export',
      );
    } finally {
      setBusy(false);
    }
  };

  if (!trip) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.missing}>Trip not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Choose a Design</Text>
        <Text style={styles.sub}>
          Story-ready templates for Instagram, TikTok, and friends.
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            {FILTERS.map((f) => {
              const active = filter === f;
              return (
                <Pressable
                  key={f}
                  onPress={() => setFilter(f)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {f}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.previewWrap}>
          <ViewShot
            ref={shotRef}
            options={{
              format: 'png',
              quality: 1,
              result: Platform.OS === 'web' ? 'data-uri' : 'tmpfile',
            }}
          >
            <ShareCardCanvas trip={trip} design={design} width={280} />
          </ViewShot>
        </View>

        <Text style={styles.section}>Templates</Text>
        <View style={styles.templateGrid}>
          {visible.map((t) => {
            const active = design.templateId === t.id;
            return (
              <Pressable
                key={t.id}
                onPress={() => patch({ templateId: t.id })}
                style={[styles.templateCard, active && styles.templateActive]}
              >
                <Text style={styles.templateLabel}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.section}>Accent</Text>
        <View style={styles.chipRow}>
          {ACCENTS.map((c) => (
            <Pressable
              key={c}
              onPress={() => patch({ accentColor: c })}
              style={[
                styles.swatch,
                { backgroundColor: c },
                design.accentColor === c && styles.swatchActive,
              ]}
            />
          ))}
        </View>

        <Text style={styles.section}>Title</Text>
        <TextInput
          style={styles.input}
          value={design.title}
          onChangeText={(title) => patch({ title })}
        />
        <Text style={styles.section}>Caption</Text>
        <TextInput
          style={styles.input}
          value={design.subtitle}
          onChangeText={(subtitle) => patch({ subtitle })}
        />

        <Text style={styles.section}>Show on card</Text>
        {(
          [
            ['showRoute', 'Route map'],
            ['showDistance', 'Distance'],
            ['showDuration', 'Duration'],
            ['showElevation', 'Elevation'],
          ] as const
        ).map(([key, label]) => (
          <View key={key} style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>{label}</Text>
            <Switch
              value={design[key]}
              onValueChange={(v) => patch({ [key]: v })}
              trackColor={{ true: colors.route, false: colors.border }}
            />
          </View>
        ))}

        <Pressable
          style={[styles.exportBtn, busy && { opacity: 0.6 }]}
          onPress={exportImage}
          disabled={busy}
        >
          <Text style={styles.exportText}>
            {busy ? 'Exporting…' : 'Export & share'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  heading: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 26,
    color: colors.ink,
  },
  sub: {
    fontFamily: 'SourceSans3_400Regular',
    color: colors.inkMuted,
    marginTop: 6,
    marginBottom: 14,
  },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  chipText: {
    fontFamily: 'SourceSans3_600SemiBold',
    color: colors.ink,
  },
  chipTextActive: { color: '#fff' },
  previewWrap: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
    paddingVertical: 16,
    backgroundColor: colors.dark,
    borderRadius: radii.lg,
  },
  section: {
    fontFamily: 'Outfit_600SemiBold',
    color: colors.ink,
    marginTop: 18,
    marginBottom: 8,
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  templateCard: {
    width: '48%' as `${number}%`,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingVertical: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  templateActive: {
    borderColor: colors.route,
    borderWidth: 2,
  },
  templateLabel: {
    fontFamily: 'Outfit_600SemiBold',
    color: colors.ink,
  },
  swatch: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchActive: { borderColor: colors.ink },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 16,
    color: colors.ink,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  toggleLabel: {
    fontFamily: 'SourceSans3_400Regular',
    color: colors.ink,
  },
  exportBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.ink,
    borderRadius: radii.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  exportText: {
    fontFamily: 'Outfit_700Bold',
    color: '#fff',
    fontSize: 16,
  },
  missing: {
    padding: spacing.lg,
    fontFamily: 'SourceSans3_400Regular',
  },
});

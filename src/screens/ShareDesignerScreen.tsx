import React, { useMemo, useRef, useState } from 'react';
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
import { colors, radii, spacing, typography } from '../theme';

type Props = StackScreenProps<RootStackParamList, 'ShareDesigner'>;

const TEMPLATES: { id: ShareTemplateId; label: string }[] = [
  { id: 'sunset', label: 'Sunset' },
  { id: 'night', label: 'Night' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'postcard', label: 'Postcard' },
  { id: 'trail', label: 'Trail' },
];

const ACCENTS = ['#E85D04', '#F4A261', '#2A9D8F', '#E9C46A', '#264653', '#E76F51'];

export function ShareDesignerScreen({ route }: Props) {
  const { tripId } = route.params;
  const { getTrip } = useTrips();
  const trip = getTrip(tripId);
  const shotRef = useRef<React.ElementRef<typeof ViewShot>>(null);
  const [busy, setBusy] = useState(false);

  const [design, setDesign] = useState<ShareDesign>(() => ({
    templateId: 'sunset',
    title: trip?.title ?? 'My trip',
    subtitle: 'Tracked with TripTrack',
    accentColor: '#E85D04',
    showDistance: true,
    showDuration: true,
    showAvgSpeed: true,
    showRoute: true,
  }));

  const patch = (partial: Partial<ShareDesign>) =>
    setDesign((d) => ({ ...d, ...partial }));

  const canShare = useMemo(() => !!trip, [trip]);

  const exportImage = async () => {
    if (!shotRef.current?.capture) {
      Alert.alert('Export unavailable', 'Could not capture the share card.');
      return;
    }
    try {
      setBusy(true);
      const uri = await shotRef.current.capture();
      if (Platform.OS === 'web') {
        // Trigger download in browser
        const a = document.createElement('a');
        a.href = uri;
        a.download = `triptrack-${tripId}.png`;
        a.click();
        Alert.alert('Downloaded', 'Share card image saved.');
      } else if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Share your trip',
        });
      } else {
        Alert.alert('Saved', `Image ready at:\n${uri}`);
      }
    } catch (e) {
      Alert.alert(
        'Share failed',
        e instanceof Error ? e.message : 'Unable to export card',
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
        <Text style={styles.heading}>Design your share card</Text>
        <Text style={styles.sub}>
          Pick a template, tweak metrics, then export to Instagram, Stories, or
          anywhere else.
        </Text>

        <View style={styles.previewWrap}>
          <ViewShot
            ref={shotRef}
            options={{
              format: 'png',
              quality: 1,
              result: Platform.OS === 'web' ? 'data-uri' : 'tmpfile',
            }}
          >
            <ShareCardCanvas trip={trip} design={design} width={320} />
          </ViewShot>
        </View>

        <Text style={styles.section}>Template</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            {TEMPLATES.map((t) => {
              const active = design.templateId === t.id;
              return (
                <Pressable
                  key={t.id}
                  onPress={() => patch({ templateId: t.id })}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

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
          placeholder="Trip title"
          placeholderTextColor={colors.inkFaint}
        />
        <Text style={styles.section}>Caption</Text>
        <TextInput
          style={styles.input}
          value={design.subtitle}
          onChangeText={(subtitle) => patch({ subtitle })}
          placeholder="Short caption"
          placeholderTextColor={colors.inkFaint}
        />

        <Text style={styles.section}>Show on card</Text>
        {(
          [
            ['showRoute', 'Route map'],
            ['showDistance', 'Distance'],
            ['showDuration', 'Duration'],
            ['showAvgSpeed', 'Average speed'],
          ] as const
        ).map(([key, label]) => (
          <View key={key} style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>{label}</Text>
            <Switch
              value={design[key]}
              onValueChange={(v) => patch({ [key]: v })}
              trackColor={{ true: colors.primary, false: colors.border }}
            />
          </View>
        ))}

        <Pressable
          style={[styles.exportBtn, (!canShare || busy) && { opacity: 0.6 }]}
          onPress={exportImage}
          disabled={!canShare || busy}
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
  heading: { ...typography.title, color: colors.ink },
  sub: { ...typography.body, color: colors.inkMuted, marginTop: 6, marginBottom: 16 },
  previewWrap: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    marginBottom: 8,
  },
  section: {
    ...typography.bodyBold,
    color: colors.ink,
    marginTop: 18,
    marginBottom: 8,
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
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontFamily: 'SourceSans3_600SemiBold',
    color: colors.ink,
  },
  chipTextActive: { color: '#fff' },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchActive: {
    borderColor: colors.ink,
  },
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
  toggleLabel: { ...typography.body, color: colors.ink },
  exportBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  exportText: {
    fontFamily: 'Outfit_700Bold',
    color: '#fff',
    fontSize: 16,
  },
  missing: { ...typography.body, padding: spacing.lg },
});

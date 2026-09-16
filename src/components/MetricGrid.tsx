import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

type Metric = { label: string; value: string };

type Props = {
  metrics: Metric[];
  columns?: 2 | 3;
  dark?: boolean;
};

export function MetricGrid({ metrics, columns = 3, dark = false }: Props) {
  return (
    <View style={styles.row}>
      {metrics.map((m) => (
        <View
          key={m.label}
          style={[styles.cell, { width: `${100 / columns}%` as `${number}%` }]}
        >
          <Text style={[styles.value, dark && styles.valueDark]}>{m.value}</Text>
          <Text style={[styles.label, dark && styles.labelDark]}>{m.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { paddingVertical: 8, paddingRight: 8 },
  value: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 22,
    color: colors.ink,
    letterSpacing: -0.4,
  },
  valueDark: { color: '#FFFFFF' },
  label: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 12,
    color: colors.inkMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: 2,
  },
  labelDark: { color: 'rgba(255,255,255,0.65)' },
});

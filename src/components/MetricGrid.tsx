import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../theme';

type Metric = {
  label: string;
  value: string;
};

type Props = {
  metrics: Metric[];
  columns?: 2 | 3 | 4;
};

export function MetricGrid({ metrics, columns = 3 }: Props) {
  return (
    <View style={styles.row}>
      {metrics.map((m) => (
        <View key={m.label} style={[styles.cell, { width: `${100 / columns}%` as `${number}%` }]}>
          <Text style={styles.value}>{m.value}</Text>
          <Text style={styles.label}>{m.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    paddingVertical: 8,
    paddingRight: 8,
  },
  value: {
    ...typography.metric,
    color: colors.ink,
    fontSize: 22,
  },
  label: {
    ...typography.metricLabel,
    marginTop: 2,
  },
});

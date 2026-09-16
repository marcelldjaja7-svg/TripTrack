export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatDuration(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function formatDurationShort(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return `${totalSec}s`;
}

export function formatSpeed(mps: number): string {
  const kmh = mps * 3.6;
  if (!Number.isFinite(kmh) || kmh < 0.05) return '0.0 km/h';
  return `${kmh.toFixed(1)} km/h`;
}

export function formatElevation(meters: number): string {
  return `${Math.round(meters).toLocaleString()} m`;
}

export function formatWhen(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleDateString([], {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatRelative(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function defaultTripTitle(startedAt: number): string {
  const hour = new Date(startedAt).getHours();
  if (hour < 11) return 'Morning trip';
  if (hour < 17) return 'Afternoon trip';
  if (hour < 21) return 'Evening trip';
  return 'Night trip';
}

export function estimateCalories(distanceMeters: number, durationMs: number): number {
  const hours = Math.max(durationMs / 3_600_000, 0.05);
  const km = distanceMeters / 1000;
  return Math.round(km * 28 + hours * 90);
}

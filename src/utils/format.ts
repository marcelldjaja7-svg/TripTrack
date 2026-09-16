export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(2)} km`;
}

export function formatDuration(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m.toString().padStart(2, '0')}m`;
  if (m > 0) return `${m}m ${s.toString().padStart(2, '0')}s`;
  return `${s}s`;
}

export function formatSpeed(mps: number): string {
  const kmh = mps * 3.6;
  if (!Number.isFinite(kmh) || kmh < 0.05) return '0.0 km/h';
  return `${kmh.toFixed(1)} km/h`;
}

export function formatPace(mps: number): string {
  if (!Number.isFinite(mps) || mps < 0.3) return '-- /km';
  const secPerKm = 1000 / mps;
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  return `${m}:${s.toString().padStart(2, '0')} /km`;
}

export function formatWhen(timestamp: number): string {
  const d = new Date(timestamp);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (sameDay) return `Today at ${time}`;
  return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${time}`;
}

export function defaultTripTitle(startedAt: number): string {
  const hour = new Date(startedAt).getHours();
  if (hour < 11) return 'Morning trip';
  if (hour < 17) return 'Afternoon trip';
  if (hour < 21) return 'Evening trip';
  return 'Night trip';
}

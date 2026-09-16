import type { GeoPoint } from '../types';

const EARTH_RADIUS_M = 6371000;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function haversineMeters(
  a: Pick<GeoPoint, 'latitude' | 'longitude'>,
  b: Pick<GeoPoint, 'latitude' | 'longitude'>,
): number {
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function pathDistanceMeters(points: GeoPoint[]): number {
  if (points.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += haversineMeters(points[i - 1], points[i]);
  }
  return total;
}

export function boundingBox(points: GeoPoint[]) {
  if (!points.length) {
    return { minLat: 0, maxLat: 0, minLon: 0, maxLon: 0 };
  }
  let minLat = points[0].latitude;
  let maxLat = points[0].latitude;
  let minLon = points[0].longitude;
  let maxLon = points[0].longitude;
  for (const p of points) {
    minLat = Math.min(minLat, p.latitude);
    maxLat = Math.max(maxLat, p.latitude);
    minLon = Math.min(minLon, p.longitude);
    maxLon = Math.max(maxLon, p.longitude);
  }
  return { minLat, maxLat, minLon, maxLon };
}

/** Project GPS points into a padded SVG viewBox path string. */
export function pointsToSvgPath(
  points: GeoPoint[],
  width: number,
  height: number,
  padding = 16,
): string {
  if (points.length < 2) return '';
  const { minLat, maxLat, minLon, maxLon } = boundingBox(points);
  const latSpan = Math.max(maxLat - minLat, 0.0001);
  const lonSpan = Math.max(maxLon - minLon, 0.0001);
  const usableW = width - padding * 2;
  const usableH = height - padding * 2;

  const coords = points.map((p) => {
    const x = padding + ((p.longitude - minLon) / lonSpan) * usableW;
    const y = padding + (1 - (p.latitude - minLat) / latSpan) * usableH;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return `M ${coords[0]} L ${coords.slice(1).join(' ')}`;
}

/**
 * Demo route that advances at a realistic speed (~28 km/h).
 * Distance grows with elapsed time instead of spanning a fixed path early.
 */
export function createSimulatedRoute(
  start: { latitude: number; longitude: number },
  startedAt: number,
  elapsedMs: number,
  options?: { stepMs?: number; speedMps?: number },
): GeoPoint[] {
  const stepMs = options?.stepMs ?? 1000;
  const speedMps = options?.speedMps ?? 8;
  const points: GeoPoint[] = [];
  const steps = Math.max(1, Math.floor(elapsedMs / stepMs));
  const latPerMeter = 1 / 111_320;
  const lonPerMeter =
    1 / (111_320 * Math.max(0.2, Math.cos(toRad(start.latitude))));
  const metersPerStep = speedMps * (stepMs / 1000);

  for (let i = 0; i <= steps; i += 1) {
    const meters = i * metersPerStep;
    const bend = Math.sin(i / 9) * 4;
    const drift = Math.cos(i / 7) * 2.5;
    points.push({
      latitude: start.latitude + (meters * 0.75 + bend) * latPerMeter,
      longitude: start.longitude + (meters * 0.55 + drift) * lonPerMeter,
      timestamp: startedAt + i * stepMs,
      speed: speedMps + Math.sin(i / 5) * 1.5,
    });
  }
  return points;
}

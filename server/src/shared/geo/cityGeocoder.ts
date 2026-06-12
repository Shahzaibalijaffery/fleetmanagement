import type { LatLng } from './geo.types';

const CITY_COORDINATES: Record<string, LatLng> = {
  lahore: { latitude: 31.5204, longitude: 74.3587 },
  karachi: { latitude: 24.8607, longitude: 67.0011 },
  islamabad: { latitude: 33.6844, longitude: 73.0479 },
  rawalpindi: { latitude: 33.5651, longitude: 73.0169 },
  faisalabad: { latitude: 31.4504, longitude: 73.135 },
  multan: { latitude: 30.1575, longitude: 71.5249 },
  peshawar: { latitude: 34.0151, longitude: 71.5249 },
  quetta: { latitude: 30.1798, longitude: 66.975 },
  sialkot: { latitude: 32.4945, longitude: 74.5229 },
  gujranwala: { latitude: 32.1877, longitude: 74.1945 },
  hyderabad: { latitude: 25.396, longitude: 68.3578 },
  abbottabad: { latitude: 34.1688, longitude: 73.2215 },
  sargodha: { latitude: 32.0836, longitude: 72.6711 },
  bahawalpur: { latitude: 29.3956, longitude: 71.6836 },
  sukkur: { latitude: 27.7052, longitude: 68.8574 },
};

function normalizeCityKey(city: string): string {
  return city.trim().toLowerCase();
}

export function geocodeCity(city: string): LatLng | null {
  if (!city.trim()) {
    return null;
  }

  return CITY_COORDINATES[normalizeCityKey(city)] ?? null;
}

export function toGeoPoint(coords: LatLng) {
  return {
    type: 'Point' as const,
    coordinates: [coords.longitude, coords.latitude] as [number, number],
  };
}

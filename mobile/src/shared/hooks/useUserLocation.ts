import Geolocation from '@react-native-community/geolocation';
import { useCallback, useEffect, useState } from 'react';

import { geocodeCity } from '@/shared/geo/cityGeocoder';
import { useAuthStore } from '@/stores/auth.store';

export type UserLocationStatus = 'loading' | 'ready' | 'error';

export interface UserCoordinates {
  latitude: number;
  longitude: number;
}

export function useUserLocation() {
  const user = useAuthStore((state) => state.user);
  const [coords, setCoords] = useState<UserCoordinates | null>(null);
  const [status, setStatus] = useState<UserLocationStatus>('loading');

  const applyFallbackCoords = useCallback(() => {
    const fallback = user?.city ? geocodeCity(user.city) : null;
    if (fallback) {
      setCoords(fallback);
      setStatus('ready');
      return;
    }

    setCoords(null);
    setStatus('error');
  }, [user?.city]);

  const refreshLocation = useCallback(() => {
    setStatus('loading');

    Geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setStatus('ready');
      },
      () => {
        applyFallbackCoords();
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      },
    );
  }, [applyFallbackCoords]);

  useEffect(() => {
    refreshLocation();
  }, [refreshLocation]);

  return {
    coords,
    status,
    referenceCity: user?.city?.trim() || undefined,
    refreshLocation,
  };
}

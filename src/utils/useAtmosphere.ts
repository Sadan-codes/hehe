import { useState, useEffect, useCallback, useRef } from 'react';
import {
  WeatherCondition,
  AtmosphereMode,
  AtmosphereIntensity,
  WeatherData,
  getLocalTimeAtmosphere,
  mapWmoToCondition,
  getLocalCityName,
  loadStoredWeatherPrefs,
  saveStoredWeatherPrefs,
} from './weather';
import { sound } from './audio';

export function useAtmosphere() {
  const initialPrefs = useRef(loadStoredWeatherPrefs()).current;
  const initialLocal = getLocalTimeAtmosphere();

  const [mode, setModeState] = useState<AtmosphereMode>(initialPrefs.mode);
  const [intensity, setIntensityState] = useState<AtmosphereIntensity>(
    initialPrefs.intensity
  );
  const [ambientRainAudio, setAmbientRainAudioState] = useState<boolean>(
    initialPrefs.ambientRainAudio
  );

  const [condition, setCondition] = useState<WeatherCondition>(() => {
    return initialPrefs.mode === 'auto'
      ? initialLocal.condition
      : initialPrefs.mode;
  });
  const [temperature, setTemperature] = useState<number | null>(
    initialLocal.temperature
  );
  const [weatherDescription, setWeatherDescription] = useState<string>(
    initialLocal.description
  );
  const [locationName, setLocationName] = useState<string>(getLocalCityName());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasLocationPermission, setHasLocationPermission] = useState<
    boolean | null
  >(null);

  // Refresh atmosphere based on current local device time (no location permissions needed)
  const refreshAtmosphere = useCallback(() => {
    setIsLoading(true);
    try {
      const local = getLocalTimeAtmosphere();
      setTemperature(local.temperature);
      setWeatherDescription(local.description);
      setLocationName(getLocalCityName());
      if (mode === 'auto') {
        setCondition(local.condition);
      }
    } finally {
      setIsLoading(false);
    }
  }, [mode]);

  // Initial update when mode changes or on mount
  useEffect(() => {
    if (mode === 'auto') {
      refreshAtmosphere();
    } else {
      setCondition(mode);
    }
  }, [mode, refreshAtmosphere]);

  // Handle ambient rain audio synchronization
  useEffect(() => {
    if (
      ambientRainAudio &&
      condition === 'rain' &&
      intensity !== 'off'
    ) {
      sound.setAmbientSound('rain');
    } else {
      if (sound.getCurrentAmbient() === 'rain' && (!ambientRainAudio || condition !== 'rain' || intensity === 'off')) {
        sound.setAmbientSound('none');
      }
    }
  }, [ambientRainAudio, condition, intensity]);

  // User Actions
  const setMode = useCallback((newMode: AtmosphereMode) => {
    setModeState(newMode);
    saveStoredWeatherPrefs({ mode: newMode });
    if (newMode !== 'auto') {
      setCondition(newMode);
    }
  }, []);

  const setIntensity = useCallback((newIntensity: AtmosphereIntensity) => {
    setIntensityState(newIntensity);
    saveStoredWeatherPrefs({ intensity: newIntensity });
  }, []);

  const toggleAmbientRainAudio = useCallback(() => {
    setAmbientRainAudioState((prev) => {
      const next = !prev;
      saveStoredWeatherPrefs({ ambientRainAudio: next });
      return next;
    });
  }, []);

  const weatherData: WeatherData = {
    condition,
    mode,
    intensity,
    temperature,
    weatherDescription,
    locationName,
    isAuto: mode === 'auto',
    isLoading,
    hasLocationPermission,
    ambientRainAudio,
  };

  return {
    weatherData,
    setMode,
    setIntensity,
    toggleAmbientRainAudio,
    detectLiveLocation: refreshAtmosphere,
    refreshAtmosphere,
  };
}

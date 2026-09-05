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

  // Fetch weather for coordinates using Open-Meteo
  const fetchWeatherForCoords = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        setIsLoading(true);
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Weather fetch failed');
        const data = await res.json();

        if (data && data.current_weather) {
          const wmo = data.current_weather.weathercode ?? 0;
          const isDay = data.current_weather.is_day ?? 1;
          const temp = Math.round(data.current_weather.temperature ?? 22);
          const currentHour = new Date().getHours();

          const mapped = mapWmoToCondition(wmo, isDay, currentHour);
          setTemperature(temp);
          setWeatherDescription(mapped.description);

          if (mode === 'auto') {
            setCondition(mapped.condition);
          }
        }
      } catch (err) {
        // Fallback to local time
        const fallback = getLocalTimeAtmosphere();
        setTemperature(fallback.temperature);
        setWeatherDescription(fallback.description);
        if (mode === 'auto') {
          setCondition(fallback.condition);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [mode]
  );

  // Attempt live location detection
  const detectLiveLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setHasLocationPermission(false);
      const fallback = getLocalTimeAtmosphere();
      setTemperature(fallback.temperature);
      setWeatherDescription(fallback.description);
      if (mode === 'auto') setCondition(fallback.condition);
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setHasLocationPermission(true);
        fetchWeatherForCoords(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      (error) => {
        setHasLocationPermission(false);
        setIsLoading(false);
        const fallback = getLocalTimeAtmosphere();
        setTemperature(fallback.temperature);
        setWeatherDescription(`${fallback.description} (Local Time)`);
        if (mode === 'auto') setCondition(fallback.condition);
      },
      {
        enableHighAccuracy: false,
        timeout: 7000,
        maximumAge: 600000, // 10 minutes cache
      }
    );
  }, [fetchWeatherForCoords, mode]);

  // Initial detection when mode is 'auto'
  useEffect(() => {
    if (mode === 'auto') {
      detectLiveLocation();
    } else {
      setCondition(mode);
    }
  }, [mode, detectLiveLocation]);

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
    detectLiveLocation,
  };
}

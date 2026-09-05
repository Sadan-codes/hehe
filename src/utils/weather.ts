export type WeatherCondition = 'sunlight' | 'rain' | 'golden_hour' | 'cloudy' | 'night_stars' | 'snow';

export type AtmosphereMode = 'auto' | WeatherCondition;

export type AtmosphereIntensity = 'subtle' | 'gentle' | 'vibrant' | 'off';

export interface WeatherData {
  condition: WeatherCondition;
  mode: AtmosphereMode;
  intensity: AtmosphereIntensity;
  temperature: number | null;
  weatherDescription: string;
  locationName: string;
  isAuto: boolean;
  isLoading: boolean;
  hasLocationPermission: boolean | null;
  ambientRainAudio: boolean;
  error?: string;
}

const STORAGE_KEY_WEATHER_PREFS = 'love_app_weather_prefs';

interface StoredWeatherPrefs {
  mode: AtmosphereMode;
  intensity: AtmosphereIntensity;
  ambientRainAudio: boolean;
}

export const WEATHER_PRESETS: {
  id: WeatherCondition;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  badge: string;
}[] = [
  {
    id: 'sunlight',
    name: 'Soft Sunlight',
    shortName: 'Sunlight',
    icon: '☀️',
    description: 'Gentle diagonal sunbeams, warm golden dust motes, and soft amber glow',
    badge: 'Warm & Dreamy',
  },
  {
    id: 'rain',
    name: 'Light Rain & Drizzle',
    shortName: 'Light Rain',
    icon: '🌧️',
    description: 'Delicate translucent raindrops, soft ground ripples, and tender mist',
    badge: 'Cozy & Romantic',
  },
  {
    id: 'golden_hour',
    name: 'Golden Hour Sunset',
    shortName: 'Golden Hour',
    icon: '🌅',
    description: 'Dreamy peach and rose-gold horizon glow with shimmering warm bokeh',
    badge: 'Magical Twilight',
  },
  {
    id: 'cloudy',
    name: 'Misty Breeze',
    shortName: 'Misty Breeze',
    icon: '🌫️',
    description: 'Soft rolling pastel clouds and a serene calm atmospheric haze',
    badge: 'Peaceful & Soft',
  },
  {
    id: 'night_stars',
    name: 'Romantic Starlight',
    shortName: 'Starlight',
    icon: '✨',
    description: 'Deep celestial violet-rose tint with soft twinkling star dust',
    badge: 'Midnight Romance',
  },
  {
    id: 'snow',
    name: 'Winter Romance',
    shortName: 'Gentle Snow',
    icon: '❄️',
    description: 'Slow, graceful white-pink snowflakes drifting through the air',
    badge: 'Pure & Tender',
  },
];

export function getLocalTimeAtmosphere(): {
  condition: WeatherCondition;
  description: string;
  temperature: number;
} {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 6 && hour < 8) {
    return { condition: 'golden_hour', description: 'Early Morning Sunbeams', temperature: 18 };
  } else if (hour >= 8 && hour < 17) {
    return { condition: 'sunlight', description: 'Gentle Warm Sunlight', temperature: 23 };
  } else if (hour >= 17 && hour < 20) {
    return { condition: 'golden_hour', description: 'Romantic Golden Hour Sunset', temperature: 21 };
  } else {
    return { condition: 'night_stars', description: 'Clear Starlit Night', temperature: 16 };
  }
}

export function mapWmoToCondition(
  wmoCode: number,
  isDay: number,
  hour: number
): { condition: WeatherCondition; description: string } {
  // Rain / Drizzle / Showers / Storm
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(wmoCode)) {
    return { condition: 'rain', description: 'Light Romantic Rain' };
  }
  // Snow / Sleet
  if ([71, 73, 75, 77, 85, 86].includes(wmoCode)) {
    return { condition: 'snow', description: 'Gentle Winter Snow' };
  }
  // Fog / Mist
  if ([45, 48].includes(wmoCode)) {
    return { condition: 'cloudy', description: 'Misty Romantic Breeze' };
  }
  // Clouds
  if (wmoCode === 2 || wmoCode === 3) {
    return { condition: 'cloudy', description: 'Soft Overcast Skies' };
  }
  // Clear / Sunny
  if (isDay === 0) {
    return { condition: 'night_stars', description: 'Clear Starlit Sky' };
  }
  // If daytime clear, check if golden hour
  if ((hour >= 17 && hour <= 19) || (hour >= 6 && hour <= 7)) {
    return { condition: 'golden_hour', description: 'Sunset Golden Glow' };
  }
  return { condition: 'sunlight', description: 'Soft Golden Sunlight' };
}

export function getLocalCityName(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && tz.includes('/')) {
      const city = tz.split('/')[1]?.replace(/_/g, ' ');
      if (city) return city;
    }
  } catch {}
  return 'Your Location';
}

export function loadStoredWeatherPrefs(): StoredWeatherPrefs {
  try {
    const item = localStorage.getItem(STORAGE_KEY_WEATHER_PREFS);
    if (item) {
      const parsed = JSON.parse(item);
      return {
        mode: parsed.mode || 'auto',
        intensity: parsed.intensity || 'subtle',
        ambientRainAudio: parsed.ambientRainAudio ?? false,
      };
    }
  } catch {}
  return {
    mode: 'auto',
    intensity: 'subtle',
    ambientRainAudio: false,
  };
}

export function saveStoredWeatherPrefs(prefs: Partial<StoredWeatherPrefs>): void {
  try {
    const current = loadStoredWeatherPrefs();
    localStorage.setItem(
      STORAGE_KEY_WEATHER_PREFS,
      JSON.stringify({ ...current, ...prefs })
    );
  } catch {}
}

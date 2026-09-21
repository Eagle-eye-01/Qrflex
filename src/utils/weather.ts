export interface WeatherInfo {
  city: string;
  temp: number;
  high: number;
  low: number;
  condition: string;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  loading: boolean;
  permissionState: 'granted' | 'prompt' | 'denied';
}

const WMO_CODE_MAP: Record<number, { condition: string; icon: string }> = {
  0: { condition: 'Clear Sky', icon: 'sun' },
  1: { condition: 'Mainly Clear', icon: 'sun-cloud' },
  2: { condition: 'Partly Cloudy', icon: 'cloud-sun' },
  3: { condition: 'Overcast', icon: 'cloud' },
  45: { condition: 'Foggy', icon: 'fog' },
  48: { condition: 'Icy Fog', icon: 'fog' },
  51: { condition: 'Light Drizzle', icon: 'rain-light' },
  53: { condition: 'Moderate Drizzle', icon: 'rain' },
  55: { condition: 'Heavy Drizzle', icon: 'rain-heavy' },
  61: { condition: 'Slight Rain', icon: 'rain-light' },
  63: { condition: 'Moderate Rain', icon: 'rain' },
  65: { condition: 'Heavy Rain', icon: 'rain-heavy' },
  71: { condition: 'Slight Snow', icon: 'snow' },
  73: { condition: 'Moderate Snow', icon: 'snow' },
  75: { condition: 'Heavy Snow', icon: 'snow' },
  77: { condition: 'Snow Grains', icon: 'snow' },
  80: { condition: 'Slight Showers', icon: 'rain' },
  81: { condition: 'Moderate Showers', icon: 'rain' },
  82: { condition: 'Violent Showers', icon: 'rain-heavy' },
  85: { condition: 'Snow Showers', icon: 'snow' },
  86: { condition: 'Heavy Snow Showers', icon: 'snow' },
  95: { condition: 'Thunderstorm', icon: 'thunder' },
  96: { condition: 'Thunderstorm with Hail', icon: 'thunder' },
  99: { condition: 'Severe Thunderstorm', icon: 'thunder' },
};

export const getWeatherDescription = (code: number) => {
  return WMO_CODE_MAP[code] || { condition: 'Partly Cloudy', icon: 'cloud-sun' };
};

/**
 * Derives a clean default city name from the browser's local timezone.
 */
export const getTimezoneCity = (): string => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) {
      const parts = tz.split('/');
      const city = parts[parts.length - 1].replace(/_/g, ' ');
      return city || 'Cupertino';
    }
  } catch {
    // ignore
  }
  return 'Cupertino';
};

/**
 * Fetches real weather and location based on coordinates or fallback.
 */
export async function fetchUserWeather(
  onUpdate: (info: WeatherInfo) => void
): Promise<void> {
  const fallbackCity = getTimezoneCity();

  // Initial state while fetching
  const initialInfo: WeatherInfo = {
    city: fallbackCity,
    temp: 21,
    high: 24,
    low: 16,
    condition: 'Partly Cloudy',
    weatherCode: 2,
    humidity: 55,
    windSpeed: 12,
    loading: true,
    permissionState: 'prompt',
  };
  onUpdate(initialInfo);

  if (typeof window === 'undefined' || !navigator.geolocation) {
    onUpdate({ ...initialInfo, loading: false, permissionState: 'denied' });
    return;
  }

  const loadWeatherForCoords = async (lat: number, lon: number, cityName?: string) => {
    try {
      // 1. Fetch real weather from free Open-Meteo API
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      const weatherData = await weatherRes.json();

      let detectedCity = cityName;
      if (!detectedCity) {
        try {
          const geoRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
          );
          const geoData = await geoRes.json();
          detectedCity = geoData.city || geoData.locality || geoData.principalSubdivision || fallbackCity;
        } catch {
          detectedCity = fallbackCity;
        }
      }

      const current = weatherData.current || {};
      const daily = weatherData.daily || {};
      const code = current.weather_code ?? 2;
      const desc = getWeatherDescription(code);

      onUpdate({
        city: detectedCity || fallbackCity,
        temp: Math.round(current.temperature_2m ?? 21),
        high: Math.round(daily.temperature_2m_max?.[0] ?? 24),
        low: Math.round(daily.temperature_2m_min?.[0] ?? 16),
        condition: desc.condition,
        weatherCode: code,
        humidity: current.relative_humidity_2m ?? 55,
        windSpeed: Math.round(current.wind_speed_10m ?? 12),
        loading: false,
        permissionState: 'granted',
      });
    } catch {
      onUpdate({ ...initialInfo, loading: false });
    }
  };

  // Request user's position
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      loadWeatherForCoords(pos.coords.latitude, pos.coords.longitude);
    },
    async () => {
      // If user denies permission, gracefully use IP/timezone location
      try {
        // Fallback default coordinates (e.g. San Francisco or timezone approximation)
        await loadWeatherForCoords(37.7749, -122.4194, fallbackCity);
      } catch {
        onUpdate({ ...initialInfo, loading: false, permissionState: 'denied' });
      }
    },
    { timeout: 8000 }
  );
}

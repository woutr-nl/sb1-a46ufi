import localforage from 'localforage';
import { WeatherData, HourlyForecast } from '../types/weather';
import { format } from 'date-fns';

const CACHE_KEY = 'weather_cache';
const API_BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

interface CacheItem {
  data: WeatherData[];
  timestamp: number;
}

export const fetchWeatherData = async (
  location: string,
  apiKey: string,
  cacheDuration: number
): Promise<WeatherData[]> => {
  // Check cache first
  const cachedData = await getCachedData(location);
  if (cachedData && isDataValid(cachedData.timestamp, cacheDuration)) {
    return cachedData.data;
  }

  // Fetch fresh data for 7 days (today + 6 days)
  const url = `${API_BASE_URL}/${encodeURIComponent(location)}/next7days?unitGroup=metric&include=hours&key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather data fetch failed');
    
    const data = await response.json();
    const weatherData = transformWeatherData(data);
    
    // Cache the new data
    await cacheData(location, weatherData);
    
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

const transformWeatherData = (rawData: any): WeatherData[] => {
  return rawData.days.map((day: any) => {
    // Transform hourly data
    const hourlyForecast: HourlyForecast[] = day.hours.map((hour: any) => ({
      time: format(new Date(hour.datetimeEpoch * 1000), "yyyy-MM-dd'T'HH:mm:ss"),
      temperature: hour.temp,
      windSpeed: hour.windspeed,
      precipitation: hour.precip || 0,
    }));

    return {
      location: rawData.resolvedAddress,
      date: format(new Date(day.datetimeEpoch * 1000), 'yyyy-MM-dd'),
      temperature: day.temp,
      windSpeed: day.windspeed,
      precipitation: day.precip || 0,
      humidity: day.humidity,
      conditions: day.conditions,
      hourlyForecast,
    };
  });
};

const getCachedData = async (location: string): Promise<CacheItem | null> => {
  const cache = await localforage.getItem<Record<string, CacheItem>>(CACHE_KEY) || {};
  return cache[location] || null;
};

const cacheData = async (location: string, data: WeatherData[]): Promise<void> => {
  const cache = await localforage.getItem<Record<string, CacheItem>>(CACHE_KEY) || {};
  cache[location] = {
    data,
    timestamp: Date.now(),
  };
  await localforage.setItem(CACHE_KEY, cache);
};

const isDataValid = (timestamp: number, cacheDuration: number): boolean => {
  const now = Date.now();
  return now - timestamp < cacheDuration * 60 * 1000;
};
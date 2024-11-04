import { WeatherData, PadelScore } from '../types/weather';
import { useWeatherStore } from '../store/weatherStore';

const calculateTemperatureScore = (temp: number): number => {
  if (temp >= 18 && temp <= 25) return 10;
  if (temp >= 10 && temp < 18) return 7 + ((temp - 10) / 8) * 3;
  if (temp > 25 && temp <= 30) return 7 - ((temp - 25) / 5) * 3;
  if (temp < 10) return Math.max(0, (temp / 10) * 7);
  return Math.max(0, 7 - ((temp - 30) / 5) * 7);
};

const calculateHumidityScore = (humidity: number): number => {
  if (humidity >= 40 && humidity <= 60) return 10;
  if (humidity < 40) return 10 - ((40 - humidity) / 40) * 5;
  return 10 - ((humidity - 60) / 40) * 5;
};

const calculateWindScore = (windSpeed: number): number => {
  // More aggressive wind penalties
  if (windSpeed <= 5) return 10;                    // Perfect conditions
  if (windSpeed <= 10) return 8;                    // Still good
  if (windSpeed <= 15) return 6;                    // Getting challenging
  if (windSpeed <= 20) return 4;                    // Difficult
  if (windSpeed <= 25) return 2;                    // Very difficult
  return 0;                                         // Nearly impossible
};

const calculatePrecipitationScore = (precipitation: number): number => {
  if (precipitation === 0) return 10;
  if (precipitation <= 0.5) return 5;
  if (precipitation <= 2) return 3;
  return 0;
};

const calculateSunlightScore = (conditions: string): number => {
  const lowerConditions = conditions.toLowerCase();
  if (lowerConditions.includes('clear')) return 8;
  if (lowerConditions.includes('partly cloudy')) return 10;
  if (lowerConditions.includes('cloudy')) return 7;
  if (lowerConditions.includes('overcast')) return 6;
  if (lowerConditions.includes('rain')) return 3;
  return 5; // default for other conditions
};

export const calculatePadelScore = (weather: WeatherData): PadelScore => {
  // Calculate individual scores
  const temperatureScore = calculateTemperatureScore(weather.temperature);
  const humidityScore = calculateHumidityScore(weather.humidity);
  const windScore = calculateWindScore(weather.windSpeed);
  const precipitationScore = calculatePrecipitationScore(weather.precipitation);
  const sunlightScore = calculateSunlightScore(weather.conditions);

  // Increased wind weight (from 2.5 to 3.5) and adjusted other weights
  const weightedScore = (
    (temperatureScore * 1.0) +     // Reduced from 1.5
    (humidityScore * 0.5) +        // Reduced from 1.0
    (windScore * 3.5) +            // Increased from 2.5
    (precipitationScore * 2.5) +   // Kept the same
    (sunlightScore * 0.5)          // Kept the same
  ) / 8;

  // Round to one decimal place
  const score = Number(Math.min(10, Math.max(0, weightedScore)).toFixed(1));

  // Generate detailed message and recommendations
  let message: string;
  const recommendations: string[] = [];

  if (score >= 8) {
    message = 'Perfecte omstandigheden voor padel!';
  } else if (score >= 6) {
    message = 'Goede omstandigheden om te spelen.';
    if (windScore < 8) recommendations.push('Let op de wind bij serves.');
    if (temperatureScore < 7) recommendations.push('Zorg voor gepaste kleding.');
  } else if (score >= 4) {
    message = 'Acceptabele omstandigheden, maar wees voorbereid.';
    if (windScore < 6) recommendations.push('Sterke wind zal het spel beïnvloeden.');
    if (precipitationScore < 5) recommendations.push('Kans op regen - check de baan.');
    if (temperatureScore < 5) recommendations.push('Warm goed op voor het spelen.');
  } else {
    message = 'Niet ideaal voor padel vandaag.';
    if (windScore < 4) recommendations.push('Te winderig voor een normaal spel.');
    if (precipitationScore < 3) recommendations.push('Regen maakt de baan mogelijk glad.');
    if (temperatureScore < 3) recommendations.push('Temperatuur is niet optimaal.');
  }

  // Add weather details to message
  const details = [];
  if (weather.windSpeed > 10) details.push(`Wind: ${weather.windSpeed} km/h`);  // Lowered threshold from 15
  if (weather.precipitation > 0) details.push(`Neerslag: ${weather.precipitation} mm`);
  if (weather.temperature < 15 || weather.temperature > 25) {
    details.push(`Temperatuur: ${weather.temperature}°C`);
  }

  if (details.length > 0) {
    message += ` (${details.join(', ')})`;
  }

  return { score, message, recommendations };
};
import { WeatherData, PadelScore } from '../types/weather';

export const getPadelScore = (weather: WeatherData): PadelScore => {
  let score = 100;

  // Temperature impact (-5 points for each degree outside optimal range 15-25°C)
  if (weather.temperature < 15) {
    score -= (15 - weather.temperature) * 5;
  } else if (weather.temperature > 25) {
    score -= (weather.temperature - 25) * 5;
  }

  // Wind impact (-3 points for each km/h above 15 km/h)
  if (weather.windSpeed > 15) {
    score -= (weather.windSpeed - 15) * 3;
  }

  // Precipitation impact (-10 points for each mm of rain)
  score -= weather.precipitation * 10;

  // Ensure score stays within 0-100 range
  score = Math.max(0, Math.min(100, score));

  // Generate message based on score
  let message: string;
  const recommendations: string[] = [];

  if (score >= 80) {
    message = 'Perfecte omstandigheden voor padel!';
  } else if (score >= 60) {
    message = 'Goede omstandigheden om te spelen.';
    if (weather.windSpeed > 15) {
      recommendations.push('Let op de wind bij serves.');
    }
  } else if (score >= 40) {
    message = 'Acceptabele omstandigheden, maar wees voorbereid.';
    if (weather.temperature < 15) {
      recommendations.push('Warm goed op voor het spelen.');
    }
  } else {
    message = 'Niet ideaal voor padel vandaag.';
    if (weather.precipitation > 0) {
      recommendations.push('Controleer of de baan niet te glad is.');
    }
  }

  return { score, message, recommendations };
};
import React from 'react';
import { format, isToday } from 'date-fns';
import { nl } from 'date-fns/locale';
import { WeatherCard } from './WeatherCard';
import { WeatherData } from '../types/weather';
import { calculatePadelScore } from '../utils/padelScore';

interface WeatherForecastProps {
  forecast: WeatherData[];
  location: string;
}

export const WeatherForecast: React.FC<WeatherForecastProps> = ({ forecast, location }) => {
  // Take today plus 6 future days (7 total)
  const sevenDayForecast = forecast.slice(0, 7);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Weersvoorspelling voor {location}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {sevenDayForecast.map((weather, index) => {
          const date = new Date(weather.date);
          const isCurrentDay = isToday(date);
          const padelScore = calculatePadelScore(weather);
          
          return (
            <div key={index} className={`${isCurrentDay ? 'col-span-1 md:col-span-2 lg:col-span-3 2xl:col-span-4' : ''}`}>
              <WeatherCard
                weather={{
                  ...weather,
                  date: format(date, 'yyyy-MM-dd'),
                  score: padelScore.score,
                  message: padelScore.message,
                }}
                isToday={isCurrentDay}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
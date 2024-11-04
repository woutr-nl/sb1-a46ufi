import React from 'react';
import { Cloud, Sun, Wind, Droplets, Clock, AlertTriangle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import { WeatherData } from '../types/weather';
import { useWeatherStore } from '../store/weatherStore';

interface WeatherCardProps {
  weather: WeatherData;
  isToday?: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, isToday = false }) => {
  const { adminSettings } = useWeatherStore();

  const getConditionMessages = () => {
    const messages: string[] = [];
    const { conditionMessages } = adminSettings;

    Object.entries(conditionMessages).forEach(([condition, messageList]) => {
      messageList.forEach(message => {
        const value = condition === 'temperature' ? weather.temperature :
                     condition === 'wind' ? weather.windSpeed :
                     condition === 'precipitation' ? weather.precipitation : 0;

        if (value >= message.thresholdStart && value <= message.thresholdEnd) {
          messages.push(message.text);
        }
      });
    });

    return messages;
  };

  const getHourlyForecast = () => {
    if (!weather.hourlyForecast || !isToday) return [];
    
    const currentHour = new Date().getHours();
    return weather.hourlyForecast
      .filter(hour => {
        const hourDate = parseISO(hour.time);
        return hourDate.getHours() >= currentHour;
      })
      .slice(0, 8);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return '#22c55e';
    if (score >= 6) return '#eab308';
    if (score >= 4) return '#f97316';
    return '#ef4444';
  };

  const formatDateWithCapital = (date: string) => {
    const formatted = format(new Date(date), 'EEEE d MMMM', { locale: nl });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const hourlyForecast = getHourlyForecast();
  const conditionMessages = getConditionMessages();

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden h-full ${
      isToday ? 'border border-blue-500' : ''
    }`}>
      <div className="p-6 flex flex-col h-full">
        {isToday && (
          <div className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-2">
            Vandaag
          </div>
        )}
        
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`${isToday ? 'text-2xl' : 'text-xl'} font-bold text-gray-900 dark:text-white`}>
              {formatDateWithCapital(weather.date)}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {weather.conditions}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {weather.conditions.toLowerCase().includes('sun') ? (
              <Sun className="w-8 h-8 text-yellow-500" />
            ) : (
              <Cloud className="w-8 h-8 text-gray-500" />
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg min-h-[100px]">
            <Sun className="w-6 h-6 text-yellow-500 mb-2" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {weather.temperature}°C
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg min-h-[100px]">
            <Wind className="w-6 h-6 text-gray-500 mb-2" />
            <div className="text-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {weather.windSpeed}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                km/h
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg min-h-[100px]">
            <Droplets className="w-6 h-6 text-blue-500 mb-2" />
            <div className="text-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {weather.precipitation}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                mm
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 min-h-[120px]">
          {conditionMessages.length > 0 ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Aandachtspunten
                </span>
              </div>
              <ul className="space-y-2">
                {conditionMessages.map((msg, index) => (
                  <li 
                    key={`message-${index}`}
                    className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                    {msg}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-gray-500 dark:text-gray-400">
              Geen aandachtspunten
            </div>
          )}
        </div>

        {isToday && hourlyForecast.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Uurlijkse voorspelling
            </h4>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {hourlyForecast.map((hour, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {format(parseISO(hour.time), 'HH:mm')}
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white my-1">
                    {hour.temperature}°C
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Wind className="w-3 h-3" />
                    {hour.windSpeed} km/h
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Droplets className="w-3 h-3 text-blue-500" />
                    {hour.precipitation} mm
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Padel Score
            </span>
            <span className="font-bold text-gray-900 dark:text-white">
              {weather.score}/10
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full transition-all duration-500"
              style={{
                width: `${(weather.score / 10) * 100}%`,
                backgroundColor: getScoreColor(weather.score),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
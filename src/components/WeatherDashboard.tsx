import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { LocationSearch } from './LocationSearch';
import { WeatherForecast } from './WeatherForecast';
import { useWeatherStore } from '../store/weatherStore';
import { fetchWeatherData } from '../services/weatherApi';

export const WeatherDashboard: React.FC = () => {
  const { location, adminSettings } = useWeatherStore();

  const { data: weatherData, isLoading, error } = useQuery({
    queryKey: ['weather', location],
    queryFn: () => fetchWeatherData(location, adminSettings.apiKey, adminSettings.cacheDuration),
    enabled: !!location && !!adminSettings.apiKey,
    retry: false,
  });

  return (
    <div>
      <LocationSearch />
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">
            Weer gegevens laden...
          </p>
        </div>
      )}

      {error && (
        <div className="text-center text-red-600 dark:text-red-400 py-12">
          Er is een fout opgetreden bij het ophalen van de weer gegevens.
          {!adminSettings.apiKey && (
            <p className="mt-2 text-sm">
              Configureer eerst de API sleutel in het admin dashboard.
            </p>
          )}
        </div>
      )}

      {weatherData && <WeatherForecast forecast={weatherData} location={location} />}

      {!location && !isLoading && !error && (
        <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
          <p className="text-lg">
            Voer een locatie in om de weersvoorspelling te bekijken
          </p>
        </div>
      )}
    </div>
  );
};
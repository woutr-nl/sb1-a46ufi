import React, { useState } from 'react';
import { Search, Clock } from 'lucide-react';
import { useWeatherStore } from '../store/weatherStore';

export const LocationSearch: React.FC = () => {
  const [input, setInput] = useState('');
  const { setLocation, recentSearches } = useWeatherStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setLocation(input.trim());
    }
  };

  const handleRecentSearch = (location: string) => {
    setLocation(location);
    setInput(location);
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Voer een locatie in (bijv. Amsterdam, Nederland)"
            className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Zoeken
          </button>
        </div>
      </form>

      {recentSearches.length > 0 && (
        <div className="max-w-xl mx-auto mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Recente zoekopdrachten
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((location, index) => (
              <button
                key={index}
                onClick={() => handleRecentSearch(location)}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {location}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
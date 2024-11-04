import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, LogIn } from 'lucide-react';
import { useWeatherStore } from '../store/weatherStore';

export const Header: React.FC = () => {
  const { logo, isDarkMode, toggleDarkMode, isAuthenticated } = useWeatherStore();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex-1"></div>
          <Link to="/" className="flex items-center gap-2">
            {logo ? (
              <img src={logo} alt="Logo" className="h-8" />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Padel Weer Voorspelling
              </h1>
            )}
          </Link>
          <div className="flex-1 flex justify-end items-center gap-2">
            <Link
              to="/admin"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Admin login"
              title={isAuthenticated ? "Admin Dashboard" : "Admin Login"}
            >
              <LogIn className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Link>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
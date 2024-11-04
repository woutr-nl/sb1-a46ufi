import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { useWeatherStore } from '../store/weatherStore';

export const Layout: React.FC = () => {
  const { isDarkMode } = useWeatherStore();

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
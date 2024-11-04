import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WeatherStore, AdminSettings } from '../types/weather';
import { userService } from '../services/userService';
import { settingsService } from '../services/settingsService';

const defaultAdminSettings: AdminSettings = {
  apiKey: '',
  cacheDuration: 30,
  scoreThresholds: {
    perfect: 80,
    good: 60,
    poor: 40,
  },
  customMessages: {
    perfect: 'Perfecte omstandigheden voor padel!',
    good: 'Acceptabele omstandigheden om te spelen.',
    poor: 'Niet ideaal voor padel vandaag.',
  },
  weatherGifs: {
    rain: 'https://media.giphy.com/media/t7Qb8655Z1VfBGr5XB/giphy.gif',
    cloud: 'https://media.giphy.com/media/3oEjHB1EKuujDjYFWw/giphy.gif',
    wind: 'https://media.giphy.com/media/7VzgMsB6FLCilwS30P/giphy.gif',
    sun: 'https://media.giphy.com/media/XxkiP99atdXQqvx9oX/giphy.gif',
  },
  conditionMessages: {
    rain: [],
    wind: [],
    cold: [],
    hot: []
  },
  weatherThresholds: {
    wind: 15,
    coldTemp: 15,
    hotTemp: 25,
    precipitation: 0,
  }
};

export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      weatherData: null,
      setWeatherData: (data) => set({ weatherData: data }),
      location: '',
      setLocation: (location) => {
        set((state) => ({
          location,
          recentSearches: [
            location,
            ...state.recentSearches.filter((l) => l !== location),
          ].slice(0, 5),
        }));
      },
      recentSearches: [],
      addRecentSearch: (location) =>
        set((state) => ({
          recentSearches: [
            location,
            ...state.recentSearches.filter((l) => l !== location),
          ].slice(0, 5),
        })),
      isAuthenticated: false,
      currentUser: null,
      login: async (username: string, password: string) => {
        const user = await userService.validateCredentials(username, password);
        if (user) {
          set({ isAuthenticated: true, currentUser: user });
        } else {
          throw new Error('Invalid credentials');
        }
      },
      logout: () => set({ isAuthenticated: false, currentUser: null }),
      logo: null,
      setLogo: (logo) => set({ logo }),
      adminSettings: defaultAdminSettings,
      setAdminSettings: async (settings) => {
        set({ adminSettings: settings });
        await settingsService.setSetting('adminSettings', JSON.stringify(settings));
      },
    }),
    {
      name: 'weather-store',
    }
  )
);
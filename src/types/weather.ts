export interface WeatherStore {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  weatherData: WeatherData[] | null;
  setWeatherData: (data: WeatherData[]) => void;
  location: string;
  setLocation: (location: string) => void;
  recentSearches: string[];
  addRecentSearch: (location: string) => void;
  isAuthenticated: boolean;
  currentUser: any | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  logo: string | null;
  setLogo: (logo: string | null) => void;
  adminSettings: AdminSettings;
  setAdminSettings: (settings: AdminSettings) => Promise<void>;
}

export interface WeatherData {
  location: string;
  date: string;
  temperature: number;
  windSpeed: number;
  precipitation: number;
  humidity: number;
  conditions: string;
  hourlyForecast?: HourlyForecast[];
  score?: number;
  message?: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  windSpeed: number;
  precipitation: number;
}

export interface PadelScore {
  score: number;
  message: string;
  recommendations: string[];
}

export interface WeatherMessage {
  text: string;
  thresholdStart: number;
  thresholdEnd: number;
}

export interface AdminSettings {
  apiKey: string;
  cacheDuration: number;
  scoreThresholds: {
    perfect: number;
    good: number;
    poor: number;
  };
  customMessages: {
    perfect: string;
    good: string;
    poor: string;
  };
  weatherGifs: {
    [key: string]: string;
  };
  conditionMessages: {
    [key: string]: WeatherMessage[];
  };
  weatherThresholds: {
    wind: number;
    coldTemp: number;
    hotTemp: number;
    precipitation: number;
  };
}
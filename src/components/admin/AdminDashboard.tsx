import React, { useState, useRef } from 'react';
import { Save, Lock, Upload, LogOut, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminSettings, WeatherMessage } from '../../types/weather';
import { useWeatherStore } from '../../store/weatherStore';
import { RangeSlider } from './RangeSlider';
import { UserManagement } from './UserManagement';
import { StorageManagement } from './StorageManagement';
import toast from 'react-hot-toast';

export const AdminDashboard: React.FC = () => {
  const { adminSettings, setAdminSettings, logout, setLogo } = useWeatherStore();
  const [currentSettings, setCurrentSettings] = useState<AdminSettings>(adminSettings);
  const [activeTab, setActiveTab] = useState<'settings' | 'users' | 'storage'>('settings');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminSettings(currentSettings);
    toast.success('Settings saved successfully');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
        toast.success('Logo uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const updateWeatherGif = (condition: string, url: string) => {
    setCurrentSettings({
      ...currentSettings,
      weatherGifs: {
        ...currentSettings.weatherGifs,
        [condition]: url,
      },
    });
  };

  const updateConditionMessage = (condition: string, index: number, updates: Partial<WeatherMessage>) => {
    const messages = [...(currentSettings.conditionMessages[condition] || [])];
    messages[index] = { ...messages[index], ...updates };
    setCurrentSettings({
      ...currentSettings,
      conditionMessages: {
        ...currentSettings.conditionMessages,
        [condition]: messages,
      },
    });
  };

  const addConditionMessage = (condition: string) => {
    const messages = [
      ...(currentSettings.conditionMessages[condition] || []),
      { text: '', thresholdStart: 0, thresholdEnd: 10 }
    ];
    setCurrentSettings({
      ...currentSettings,
      conditionMessages: {
        ...currentSettings.conditionMessages,
        [condition]: messages,
      },
    });
  };

  const removeConditionMessage = (condition: string, index: number) => {
    const messages = [...(currentSettings.conditionMessages[condition] || [])];
    messages.splice(index, 1);
    setCurrentSettings({
      ...currentSettings,
      conditionMessages: {
        ...currentSettings.conditionMessages,
        [condition]: messages,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h2>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Uitloggen
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'settings'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'users'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('storage')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'storage'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Storage
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'settings' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Logo Upload
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Logo Uploaden
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Sleutel
                </label>
                <input
                  type="password"
                  value={currentSettings.apiKey}
                  onChange={(e) => setCurrentSettings({
                    ...currentSettings,
                    apiKey: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cache Duur (minuten)
                </label>
                <input
                  type="number"
                  value={currentSettings.cacheDuration}
                  onChange={(e) => setCurrentSettings({
                    ...currentSettings,
                    cacheDuration: parseInt(e.target.value) || 30
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-900 dark:text-white"
                />
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Weer GIFs
                </h3>
                <div className="space-y-4">
                  {Object.entries(currentSettings.weatherGifs).map(([condition, url]) => (
                    <div key={condition}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {condition.charAt(0).toUpperCase() + condition.slice(1)}
                      </label>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => updateWeatherGif(condition, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-900 dark:text-white"
                        placeholder="GIF URL"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Weer Berichten
                </h3>
                <div className="space-y-6">
                  {Object.entries(currentSettings.conditionMessages).map(([condition, messages]) => (
                    <div key={condition} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {condition.charAt(0).toUpperCase() + condition.slice(1)}
                        </h4>
                        <button
                          type="button"
                          onClick={() => addConditionMessage(condition)}
                          className="flex items-center gap-1 px-2 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Bericht toevoegen
                        </button>
                      </div>
                      <div className="space-y-4">
                        {messages.map((message, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={message.text}
                                onChange={(e) => updateConditionMessage(condition, index, { text: e.target.value })}
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 dark:text-white"
                                placeholder="Bericht"
                              />
                              <button
                                type="button"
                                onClick={() => removeConditionMessage(condition, index)}
                                className="p-2 text-red-600 hover:text-red-700 transition-colors"
                                title="Verwijder bericht"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="px-2">
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Drempelwaarden: {message.thresholdStart} - {message.thresholdEnd}
                              </p>
                              <RangeSlider
                                min={0}
                                max={100}
                                step={1}
                                value={[message.thresholdStart, message.thresholdEnd]}
                                onChange={([start, end]) => updateConditionMessage(condition, index, {
                                  thresholdStart: start,
                                  thresholdEnd: end
                                })}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Instellingen Opslaan
              </button>
            </form>
          ) : activeTab === 'users' ? (
            <UserManagement />
          ) : (
            <StorageManagement />
          )}
        </div>
      </div>
    </div>
  );
};
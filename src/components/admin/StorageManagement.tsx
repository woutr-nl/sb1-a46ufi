import React, { useState } from 'react';
import { Save, Database, RefreshCw } from 'lucide-react';
import { DatabaseConfig } from '../../types/database';
import { getDatabaseConfig, setDatabaseConfig } from '../../config/database';
import { testDatabaseConnection } from '../../utils/databaseTest';
import toast from 'react-hot-toast';

export const StorageManagement: React.FC = () => {
  const [config, setConfig] = useState<DatabaseConfig>(getDatabaseConfig());
  const [testing, setTesting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDatabaseConfig(config);
    toast.success('Database configuration saved successfully');
  };

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const result = await testDatabaseConnection();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to test database connection');
    } finally {
      setTesting(false);
    }
  };

  const renderDatabaseFields = () => {
    switch (config.type) {
      case 'sqlite':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Database Path
            </label>
            <input
              type="text"
              value={config.sqlite.path}
              onChange={(e) => setConfig({
                ...config,
                sqlite: { ...config.sqlite, path: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-900 dark:text-white"
            />
          </div>
        );
      case 'mysql':
      case 'postgres':
        const dbConfig = config[config.type];
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Host
              </label>
              <input
                type="text"
                value={dbConfig.host}
                onChange={(e) => setConfig({
                  ...config,
                  [config.type]: { ...dbConfig, host: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Port
              </label>
              <input
                type="number"
                value={dbConfig.port}
                onChange={(e) => setConfig({
                  ...config,
                  [config.type]: { ...dbConfig, port: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={dbConfig.username}
                onChange={(e) => setConfig({
                  ...config,
                  [config.type]: { ...dbConfig, username: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={dbConfig.password}
                onChange={(e) => setConfig({
                  ...config,
                  [config.type]: { ...dbConfig, password: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Database Name
              </label>
              <input
                type="text"
                value={dbConfig.database}
                onChange={(e) => setConfig({
                  ...config,
                  [config.type]: { ...dbConfig, database: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-900 dark:text-white"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Database Configuration
          </h3>
        </div>
        <button
          onClick={handleTestConnection}
          disabled={testing}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
          Test Connection
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Database Type
          </label>
          <select
            value={config.type}
            onChange={(e) => setConfig({
              ...config,
              type: e.target.value as DatabaseConfig['type']
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-900 dark:text-white"
          >
            <option value="sqlite">SQLite</option>
            <option value="mysql">MySQL</option>
            <option value="postgres">PostgreSQL</option>
          </select>
        </div>

        {renderDatabaseFields()}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Configuration
        </button>
      </form>
    </div>
  );
};
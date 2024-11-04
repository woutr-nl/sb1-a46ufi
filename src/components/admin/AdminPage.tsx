import React, { useState } from 'react';
import { AdminDashboard } from './AdminDashboard';
import { AdminLogin } from './AdminLogin';
import { useWeatherStore } from '../../store/weatherStore';

export const AdminPage: React.FC = () => {
  const isAuthenticated = useWeatherStore((state) => state.isAuthenticated);

  return isAuthenticated ? <AdminDashboard /> : <AdminLogin />;
};
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { WeatherDashboard } from './components/WeatherDashboard';
import { AdminPage } from './components/admin/AdminPage';

export function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<WeatherDashboard />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
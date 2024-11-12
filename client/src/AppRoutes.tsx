import { Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage';
import WeatherMap from './pages/WeatherMap';
import TestingPage from './pages/TestingPage';
import LocationTest from './test/LocationTest';
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/weather" element={<WeatherMap />} />
      <Route path="/testing" element={<TestingPage />} />
      <Route path="/locationtest" element={<LocationTest />} />
    </Routes>
  );
}

export default AppRoutes;

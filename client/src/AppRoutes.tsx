import { Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage';
import WeatherMap from './pages/WeatherMap';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/weather" element={<WeatherMap />} />
    </Routes>
  );
}

export default AppRoutes;

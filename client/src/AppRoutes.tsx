import { Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage';
import Weather from './pages/WeatherPage';
import StarMap from './pages/StarPage';
import Aurora from './pages/AuroraPage';
import Events from './pages/EventPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/weather" element={<WeatherPage />} />
      <Route path="/starmap" element={<StarMap />} />
      <Route path="/aurora" element={<Aurora />} />
      <Route path="/events" element={<Events />} />
    </Routes>
  );
}

export default AppRoutes;
import { Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage';
import WeatherPage from './pages/WeatherPage';
import StarMap from './pages/StarMap';
import EventsPage from './pages/EventsPage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/weather" element={<WeatherPage />} />
      <Route path="/starmap" element={<StarMap />} />
      <Route path="/events" element={<EventsPage />} />
    </Routes>
  );
}

export default AppRoutes;

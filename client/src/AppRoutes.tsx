import { Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage';
import Weather from './pages/Weather';
import StarMap from './pages/StarMap';
import TestingPage from './pages/TestingPage';
import LocationTest from './test/LocationTest';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/weather" element={<Weather />} />
      <Route path="/starmap" element={<StarMap />} />
      <Route path="/testing" element={<TestingPage />} />
      <Route path="/locationtest" element={<LocationTest />} />
    </Routes>
  );
}

export default AppRoutes;

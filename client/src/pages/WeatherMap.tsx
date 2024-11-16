import SignOut from '../components/SignOut'
import { Input } from '../components/ui/input'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getGeolocation } from '@/getGeolocation';

function WeatherMap(){
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchWeather = async () => {
          try {
            // Fetch the geolocation first
            const location = await getGeolocation();
            
    
            // Fetch weather data using latitude and longitude
            const response = await axios.get('http://localhost:3000/api/weather', {
              params: {
                paramLat: location.userLat,
                paramLon: location.userLong,
              },
            });
      
            console.log(response.data);
    
            // Update state with weather data
            setWeatherData(response.data);
          } catch (err) {
            // Handle errors
            if (err instanceof Error) {
              setError(err.message);
            } else {
              setError("An unknown error occurred");
            }
          }
        };
    
        fetchWeather(); // Call the async function
      }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!weatherData) {
        return <div>Loading...</div>;
    }
    return (
    <>
        <Input />
        
        <SignOut />     
    </>)
}

export default WeatherMap;
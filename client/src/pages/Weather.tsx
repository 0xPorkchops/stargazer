//import SignOut from '../components/SignOut';
import '../css/weather.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { GetGeolocation } from '../lib/utils';
import WeatherResponse from '../interfaces/WeatherResponse';
import { TransformToWeatherResponse } from '../lib/utils';
import BackgroundContainer from '../components/BackgroundContainer';

function WeatherMap(){
    const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchWeather = async () => {
          try {
            // Fetch the geolocation first
            const location = await GetGeolocation();
            
    
            // Fetch weather data using latitude and longitude
            const response = await axios.get('http://localhost:3000/api/weather', {
              params: {
                paramLat: location.userLat,
                paramLon: location.userLong,
              },
            });

            const weatherResponseData = TransformToWeatherResponse(response.data);
        
            // Update state with weather data
            setWeatherData(weatherResponseData);
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
        <BackgroundContainer backgroundSrc="./src/assets/Sun.png">
          <div className='text-center'>
            <p className='text-5xl m-8'>{weatherData.location}</p>
            <p className='font-bold text-8xl'>{weatherData.temperature.temp}°</p>
            <p className='italic'>Feels like {weatherData.temperature.feels_like}°</p>
           
          </div>
        </BackgroundContainer>
        {/*<SignOut />*/}     
    </>)
}

export default WeatherMap;
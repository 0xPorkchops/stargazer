import '../css/weather.css';
import '../css/autocomplete-input.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { GetGeolocation, TransformToWeatherResponse, TransformToForecastResponse, getWeatherIcon } from '../lib/utils';
import WeatherResponse from '../interfaces/WeatherResponse';
import ForecastResponse from '../interfaces/ForecastResponse';
import AddressAutoCompleteInput from '@/components/AddressSearchInput';
import { DayWeather } from '@/interfaces/ForecastResponse';
import LoadingContainer from '@/components/LoadingContainer';

function WeatherDisplay() {
    const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
    const [forecastData, setForecastData] = useState<ForecastResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lon: number } | null>(null);

    // Fetch weather data based on the provided latitude and longitude
    const fetchWeather = async (lat: number, lon: number) => {
        try {
            const weatherResponse = await axios.get('/api/weather', {
                params: { paramLat: lat, paramLon: lon },
            });
            const forecastResponse = await axios.get('/api/forecast', {
                params: { paramLat: lat, paramLon: lon },
            });
            setWeatherData(TransformToWeatherResponse(weatherResponse.data));
            setForecastData(TransformToForecastResponse(forecastResponse.data));
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        }
    };

    // Use geolocation as the initial location, then fetch weather data
    useEffect(() => {
        const loadInitialLocation = async () => {
            try {
                // First, get the user's geolocation
                const location = await GetGeolocation();
                
                // Set the location to be used later in the API request
                setSelectedLocation({ lat: location.userLat, lon: location.userLong });
            } catch (err) {
                setError("Unable to retrieve geolocation: " + err);
            }
        };
        loadInitialLocation();
    }, []);

    // Trigger weather fetch when the location changes
    useEffect(() => {
        if (selectedLocation) {
            fetchWeather(selectedLocation.lat, selectedLocation.lon);
        }
    }, [selectedLocation]);

    // If there's an error or weather data isn't yet loaded
    if (error) return <div>Error: {error}</div>;
    if (!weatherData){
        return (<LoadingContainer />)
    }

    return (
        <>
            <AddressAutoCompleteInput onLocationSelect={setSelectedLocation} />
            <div className="flex flex-col items-center">
                <p className="mt-8">Today</p>
                <p className="text-4xl mb-6">{weatherData.location}</p>
                <i className={`fa-solid ${getWeatherIcon(weatherData.weather.id, weatherData.sunrise, weatherData.sunset)} fa-10x mb-6`}></i>
                <p className="italic">Feels like {Math.round(weatherData.temperature.feels_like)}°</p>
                <p className="font-bold text-7xl">{Math.round(weatherData.temperature.temp)}°</p>
                <p>{weatherData.weather.description ?
                     weatherData.weather.description.charAt(0).toUpperCase() + weatherData.weather.description.slice(1) : 'No description available'}</p>
                <div className="info-container w-6/7 flex flex-col py-3">
                    <div className="flex justify-center w-full">
                        <div className="flex justify-center mx-3">
                            <i className="fa-solid fa-temperature-high"></i>
                            <p className="mx-2">H: {weatherData.temperature.temp_max}°</p>
                        </div>
                        <div className="flex justify-center mx-3">
                            <i className="fa-solid fa-temperature-low"></i>
                            <p className="mx-2">L: {weatherData.temperature.temp_min}°</p>
                        </div>
                        <div className="flex justify-center mx-3">
                            <i className="fa-solid fa-cloud"></i>
                            <p className="mx-2">Cloud: {weatherData.clouds}</p>
                        </div>
                        <div className="flex justify-center mx-3">
                            <i className="fa-solid fa-wind"></i>
                            <p className="mx-2">Wind: {weatherData.wind_speed} mi/hr</p>
                        </div>
                    </div>
                </div>
                <div className="flex border rounded-xl mb-6">
                    {forecastData && forecastData.daily.map((day : DayWeather)=>{
                        return (
                            <div className={"flex flex-col items-center mx-5"}>
                                 <p className="px-2">{day.date}</p>
                                 {/* -1, -1 means don't care about the parameter (placeholders) */}
                                 <i className={`fa-solid ${getWeatherIcon(day.weatherId, -1, -1)}`}></i> 
                                <p>{day.temp_min}° ~ {day.temp_max}°</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    );
}

export default WeatherDisplay;

import '../css/weather.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { GetGeolocation, TransformToWeatherResponse } from '../lib/utils';
import WeatherResponse from '../interfaces/WeatherResponse';
import AddressAutoCompleteInput from '@/components/AddressSearchInput';

function WeatherDisplay() {
    const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lon: number } | null>(null);

    // Fetch weather data based on the provided latitude and longitude
    const fetchWeather = async (lat: number, lon: number) => {
        try {
            const response = await axios.get('http://localhost:3000/api/weather', {
                params: { paramLat: lat, paramLon: lon },
            });
            setWeatherData(TransformToWeatherResponse(response.data));
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
    if (!weatherData) return <div>Loading...</div>;

    return (
        <>
            <AddressAutoCompleteInput onLocationSelect={setSelectedLocation} />
            <div className="flex flex-col items-center">
                <p className="text-4xl m-8">{weatherData.location}</p>
                <i className="fa-solid fa-sun fa-10x mb-6"></i>
                <p className="italic">Feels like {weatherData.temperature.feels_like}°</p>
                <p className="font-bold text-7xl">{weatherData.temperature.temp}°</p>
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
            </div>
        </>
    );
}

export default WeatherDisplay;

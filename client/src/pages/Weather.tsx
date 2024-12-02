import '../css/weather.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { GetGeolocation, TransformToWeatherResponse } from '../lib/utils';
import WeatherResponse from '../interfaces/WeatherResponse';
import AddressAutoCompleteInput from '@/components/AddressSearchInput';

function WeatherMap() {
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
            <div className="text-center">
                <p className="text-5xl m-8">{weatherData.location}</p>
                <p className="font-bold text-8xl">{weatherData.temperature.temp}°</p>
                <p className="italic">Feels like {weatherData.temperature.feels_like}°</p>
            </div>
        </>
    );
}

export default WeatherMap;

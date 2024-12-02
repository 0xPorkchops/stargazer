export default interface WeatherResponse{
    location: string;
    weather: {main: string, description: string};
    temperature: {feels_like: number, temp_min: number, temp_max: number, temp: number};
    clouds: string;
    wind_speed: number;
    sunrise: number;
    sunset: number; 
}
import WeatherResponse from "@/interfaces/WeatherResponse";
import ForecastResponse, { DayWeather } from "@/interfaces/ForecastResponse";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import RawWeatherData from "@/interfaces/RawWeatherData";
import RawForecastData from "@/interfaces/RawForecastData";
import { useTheme } from "../components/theme-provider";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function GetGeolocation():Promise<{ userLat: number; userLong: number }>{
  return new Promise((resolve, reject)=>{
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLong = position.coords.longitude;
            resolve({userLat, userLong});
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        console.log(new Error("Geolocation is not supported by this browser."));
      }
    })
}

export function TransformToWeatherResponse(data: RawWeatherData): WeatherResponse{
  return {
    location: data.name,
    weather: {
      main: data.weather[0]?.main || "Unknown",
      description: data.weather[0]?.description || "No description",
      id: parseInt(data.weather[0]?.id) || 0,
    },
    temperature: {
      temp: data.main?.temp || 0,
      feels_like: data.main?.feels_like || 0,
      temp_min: data.main?.temp_min || 0,
      temp_max: data.main?.temp_max || 0,
    },
    clouds: `${data.clouds?.all || 0}%`,
    wind_speed: data.wind?.speed || 0,
    sunrise: data.sys?.sunrise || 0,
    sunset: data.sys?.sunset || 0,
  };
}

// Function to convert timestamp to MM-DD format
const getDayFromTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000); // Convert to milliseconds
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${month}-${day}`; // Return in MM-DD format
};

export function TransformToForecastResponse(data: RawForecastData): ForecastResponse {
  const groupedByDay: Record<string, { tempMin: number; tempMax: number; count: number; weatherIds: number[] }> = {};

  // Group by day and aggregate data
  data.list.forEach(entry => {
    const day = getDayFromTimestamp(entry.dt);
    if (!groupedByDay[day]) {
      groupedByDay[day] = { tempMin: Infinity, tempMax: -Infinity, count: 0, weatherIds: [] };
    }

    // Track the minimum and maximum temperatures for the day without overwriting
    groupedByDay[day].tempMin = Math.min(groupedByDay[day].tempMin, entry.main.temp_min);
    groupedByDay[day].tempMax = Math.max(groupedByDay[day].tempMax, entry.main.temp_max);
    groupedByDay[day].count += 1;

    // Store the weather condition IDs for determining the most common weather
    groupedByDay[day].weatherIds.push(entry.weather[0]?.id);
  });

  // Calculate the most common weather and return the result
  const dailyWeather: DayWeather[] = Object.keys(groupedByDay).map(day => {
    const { tempMin, tempMax, weatherIds } = groupedByDay[day];
    
    // Find the most frequent weather condition ID
    const mostCommonWeatherId = weatherIds.reduce(
      (a, b, _, arr) =>
        arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b,
      weatherIds[0]
    );

    return {
      date: day,
      temp_min: Math.round(tempMin),  // Round min temperature
      temp_max: Math.round(tempMax),  // Round max temperature
      weatherId: mostCommonWeatherId, // Most common weather condition ID
    };
  });

  return {
    daily: dailyWeather,
  };
}

export function getWeatherIcon(weatherId:number, sunriseTimestamp: number, sunsetTimestamp: number): string{
  const dayTime = isDayTime(sunriseTimestamp, sunsetTimestamp);
  if (weatherId >= 200 && weatherId < 300) return 'fa-bolt'; // Thunderstorm
  if (weatherId >= 300 && weatherId < 500) return 'fa-cloud-drizzle'; // Drizzle
  if (weatherId >= 500 && weatherId < 600) return 'fa-cloud-showers-heavy'; // Rain
  if (weatherId >= 600 && weatherId < 700) return 'fa-snowflake'; // Snow
  if (weatherId === 781) return 'fa-tornado';
  if (weatherId >= 700 && weatherId < 800) return 'fa-smog'; // Atmosphere (mist, smoke, etc.)
  if (weatherId === 800) return dayTime ? 'fa-sun' : 'fa-moon'; // Clear
  if (weatherId > 800 && weatherId < 803) return dayTime ? 'fa-cloud-sun' : 'fa-cloud-moon'; //Some cloud
  if (weatherId >= 803) return 'fa-cloud';
  return 'fa-question'; // Fallback icon for unknown ID
};
export function isDayTime(sunriseTimestamp: number, sunsetTimestamp: number): boolean{
  if(sunriseTimestamp === -1) return true;
  const sunriseTime = new Date(sunriseTimestamp * 1000); 
  const sunsetTime = new Date(sunsetTimestamp * 1000); 
  
  // Get the current time
  const currentTime = new Date();
  
  // Check if current time is between sunrise and sunset
  return currentTime >= sunriseTime && currentTime <= sunsetTime;
};

export function ThemeStatus(): boolean{
  const { theme } = useTheme();
  const isDarkMode = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  return isDarkMode;
}
export const fetcher = (...args: [RequestInfo, RequestInit?]) => fetch(...args).then(res => res.json())
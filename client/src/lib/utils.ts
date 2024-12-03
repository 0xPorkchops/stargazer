import WeatherResponse from "@/interfaces/WeatherResponse";
import ForecastResponse, { DayWeather } from "@/interfaces/ForecastResponse";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import RawWeatherData from "@/interfaces/RawWeatherData";
import RawForecastData from "@/interfaces/RawForecastData";

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

// Function to convert timestamp to YYYY-MM-DD format
const getDayFromTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000); // Convert to milliseconds
  return date.toISOString().split('T')[0]; // Return the date in YYYY-MM-DD format
};

export function TransformToForecastResponse(data: RawForecastData): ForecastResponse{
  const groupedByDay: Record<string, { tempSum: number; count: number; weatherIds: number[] }> = {};

  // Group by day and aggregate data
  data.list.forEach(entry => {
      const day = getDayFromTimestamp(entry.dt);
      if (!groupedByDay[day]) {
          groupedByDay[day] = { tempSum: 0, count: 0, weatherIds: [] };
      }
      groupedByDay[day].tempSum += entry.main.temp;
      groupedByDay[day].count += 1;
      groupedByDay[day].weatherIds.push(entry.weather[0]?.id);
  });

  // Calculate average temperature for each day and create the final result
  const dailyWeather: DayWeather[] = Object.keys(groupedByDay).map(day => {
      const { tempSum, count, weatherIds } = groupedByDay[day];
      const avgTemp = tempSum / count; // average temperature
      const mostCommonWeatherId = weatherIds.reduce(
          (a, b, _, arr) =>
              arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b,
          weatherIds[0]
      ); // get the most frequent weather condition ID
      return { date: day, temperature: avgTemp, weatherId: mostCommonWeatherId };
  });
  

  return  {
    daily: dailyWeather,
  };
};
export const fetcher = (...args: [RequestInfo, RequestInit?]) => fetch(...args).then(res => res.json())
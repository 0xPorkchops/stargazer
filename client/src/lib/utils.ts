import WeatherResponse from "@/interfaces/WeatherResponse";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import RawWeatherData from "@/interfaces/RawWeatherData";

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
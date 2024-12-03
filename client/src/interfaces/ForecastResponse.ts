export default interface ForecastResponse {
    daily: DayWeather[];  // Array of DayWeather objects
}

export interface DayWeather {
    date: string; // date in YYYY-MM-DD format
    temperature: number; // average temperature for the day
    weatherId: number; // weather condition ID
}
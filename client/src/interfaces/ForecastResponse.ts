export default interface ForecastResponse {
    daily: DayWeather[];  // Array of DayWeather objects
}

export interface DayWeather {
    date: string; // date in MM-DD format
    temp_min: number;
    temp_max: number;
    weatherId: number; // weather condition ID
}
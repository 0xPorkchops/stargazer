export default interface RawForecastData {
    list: {
        dt: number; // timestamp in seconds
        main: {
            temp: number; // temperature in Kelvin (or Celsius, depending on API)
        };
        weather: {
            id: number; // weather condition ID
        }[];
    }[];
}

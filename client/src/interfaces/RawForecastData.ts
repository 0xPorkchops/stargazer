export default interface RawForecastData {
    list: {
        dt: number; // timestamp in seconds
        main: {
            temp_min: number;
            temp_max: number; 
        };
        weather: {
            id: number; // weather condition ID
        }[];
    }[];
}

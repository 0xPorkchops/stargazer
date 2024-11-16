export default interface RawWeatherData {
    name: string;
    weather: {
      main: string;
      description: string;
    }[];
    main: {
        temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
    };
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
    };
    sys: {
      sunrise: number;
      sunset: number;
    };
  }
  
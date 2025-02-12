import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  id: string;
  cityName: string;
  date: string;
  description: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  icon: string;

  constructor(
      id: string,
      cityName: string,
      date: string,
      description: string,
      temp: number,
      feelsLike: number,
      humidity: number,
      windSpeed: number,
      icon: string
  ) {
      this.id = id;
      this.cityName = cityName;
      this.date = date;
      this.description = description;
      this.temp = temp;
      this.feelsLike = feelsLike;
      this.humidity = humidity;
      this.windSpeed = windSpeed;
      this.icon = icon;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  baseURL: string;
  apiKey: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL ||'https://api.openweathermap.org/';
    this.apiKey = process.env.API_KEY || '';
    if (!this.apiKey) {
        throw new Error('Weather API key is required');
    }
}

  // TODO: Create fetchLocationData method
  async fetchLocationData(cityName: string) {
    const query = `${this.buildGeocodeQuery(cityName)}`; //creates url
    const response = await fetch(query);
    if (!response.ok) {
        throw new Error('Failed to fetch location data');
    }
    const locationData = await response.json();
    if (locationData.length === 0) {
        throw new Error('Location not found');
    }
    return locationData[0];
}
  // TODO: Create destructureLocationData method
  destructureLocationData(locationData: Coordinates) {
    return {
        lat: locationData.lat,
        lon: locationData.lon,
    };
}
  // TODO: Create buildGeocodeQuery method
  buildGeocodeQuery(cityName: string) {
    return `${this.baseURL}/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${this.apiKey}`;
  }

  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  buildWeatherQuery(coordinates: Coordinates) {
    return `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${this.apiKey}`;
  }

  buildForecastQuery(coordinates: Coordinates) {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  async fetchAndDestructureLocationData(cityName: string) {
    const locationData = await this.fetchLocationData(cityName);
    return this.destructureLocationData(locationData);
  }


  async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(query);
    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }
    return await response.json();
  }

  async fetchForecastData(coordinates: Coordinates) {
    const query = this.buildForecastQuery(coordinates);
    const response = await fetch(query);
    console.log(response);
    if (!response.ok) {
        throw new Error('Failed to fetch Forecast Data');
    }
    const datastuff = await response.json();
    console.log(datastuff);
    return datastuff;
  }

  parseCurrentWeather(response: any) {
    return new Weather(
        response.id,
        response.name,
        new Date().toLocaleDateString(),
        response.weather[0].description,
        response.main.temp,
        response.main.feels_like,
        response.main.humidity,
        response.wind.speed,
        response.weather[0].icon
    );
  }

  buildForecastArray(forecastData: any) {
    
    return forecastData.list.filter((data: any) => data.dt_txt?.includes('12:00:00')).map((data: any, index: number) => { 
        return new Weather(
            `${forecastData.city.id}-${index}`,
            forecastData.city.name, 
            new Date(data.dt * 1000).toLocaleDateString(),
            data.weather[0].description,
            data.main.temp,
            data.main.feels_like, 
            data.main.humidity,
            data.wind.speed, 
            data.weather[0].icon
        );
    });
  }

  async getWeatherForCity(cityName: string) {
    const coordinates = await this.fetchAndDestructureLocationData(cityName);
    console.log(coordinates);
    const weatherData = await this.fetchWeatherData(coordinates);
    console.log(weatherData);
    const forecastData = await this.fetchForecastData(coordinates);
    console.log(forecastData);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecast = this.buildForecastArray(forecastData); 
    return [currentWeather, ...forecast];
  }
}

export default new WeatherService();

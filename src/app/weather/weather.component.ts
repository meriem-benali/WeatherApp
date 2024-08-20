import { Component } from '@angular/core';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent {
  cityName: string = '';
  temperature: number = 0;
  description: string = '';
  weatherIconUrl: string = '';
  hourlyForecast: any[] = [];
  dailyForecast: any[] = [];

  constructor(private weatherService: ServiceService) {}

  getWeather() {
    const city = (document.getElementById('city') as HTMLInputElement).value;
    if (!city) return;

    this.weatherService.getCurrentWeatherByCity(city).subscribe(data => {
      this.cityName = city;
      this.temperature = data.main.temp;
      this.description = data.weather[0].description;
      this.weatherIconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    });

    this.weatherService.getForecastByCity(city).subscribe(data => {
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
      this.hourlyForecast = data.list
        .filter((hour: any) => {
          const hourDate = new Date(hour.dt * 1000).toISOString().split('T')[0];
          return hourDate === today;
        })
        .map((hour: any) => ({
          time: new Date(hour.dt * 1000).getHours(),
          iconUrl: `http://openweathermap.org/img/wn/${hour.weather[0].icon}.png`,
          temperature: hour.main.temp
        }));

      this.dailyForecast = this.aggregateDailyForecast(data.list);
    });
  }

  private aggregateDailyForecast(forecastList: any[]): any[] {
    const dailyData: { [key: string]: any } = {};

    forecastList.forEach((hour: any) => {
      const date = new Date(hour.dt * 1000).toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = {
          date: date,
          temperature: hour.main.temp,
          description: hour.weather[0].description,
          iconUrl: `http://openweathermap.org/img/wn/${hour.weather[0].icon}.png`
        };
      }
    });

    return Object.values(dailyData);
  }
}

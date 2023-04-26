import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { WeatherForecastService } from './weather-forecast.service';
import { DayForecast } from './DayForecast';
import { AdvancedForecast } from './AdvancedForecast';
import { WeatherSummary } from './WeatherSummary';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'weather-forecast';
  lat: number | null = null;
  lng: number | null = null;
  days: number | null = null;
  dailyForecast: DayForecast[] = [];
  advancedForecast: AdvancedForecast = new AdvancedForecast;
  showAdvancedForecast = false;
  city = "";
  storagedCity = "";
  maxTemperature: number[] = [];

  constructor(private forecastService: WeatherForecastService) { }

  ngOnInit(): void {

  }

  submit() {
    this.showAdvancedForecast = false;
    this.dailyForecast = [];
    this.forecastService.getCityLatLng(this.city).subscribe({
      next: (v) => {
        if (!v.results) {
          alert("Nie znaleziono twojego miasta, wpisz inne");
          return;
        }
        this.lat = v.results[0].latitude;
        this.lng = v.results[0].longitude;
        this.forecastService.getBaseWeatherData(this.lat!, this.lng!, this.days!).subscribe({
          next: (res) => {
            for (let i = 0; i < this.days! * 24 - 1; i += 24) {
              let dayForecast = new DayForecast();
              dayForecast.temperature = res.hourly.temperature_2m.slice(i, i + 24);
              dayForecast.precipitation = res.hourly.precipitation.slice(i, i + 24);
              dayForecast.cloudcover = res.hourly.cloudcover.slice(i, i + 24);
              dayForecast.day = res.hourly.time.slice(i, i + 24);
              let rainyDays = 0;
              dayForecast.precipitation.forEach((value) => {
                if(value > 0.55){
                  rainyDays ++;
                }
              });
              if(rainyDays >= 3){
                dayForecast.summary = WeatherSummary.Rainy;
              }
              else{
                if(this.getAverage(dayForecast.cloudcover) < 25){
                  dayForecast.summary = WeatherSummary.Sunny;
                }
                else if(this.getAverage(dayForecast.cloudcover) > 25 && this.getAverage(dayForecast.cloudcover) < 75){
                  dayForecast.summary = WeatherSummary.PartialCloudy;
                }
                else{
                  dayForecast.summary = WeatherSummary.Cloudy;
                }
              }
              this.dailyForecast.push(dayForecast);
            }
            this.findMaxTemperature();
            this.storagedCity = v.results[0].name;
          },
          error: (e) => alert("Wystąpił błąd, nie pobrano danych")
        });
      },
      error: (e) => alert("Wystąpił błąd, nie pobrano danych")
    });
  }

  findMaxTemperature() {
    this.maxTemperature = [];
    this.dailyForecast.forEach((forecast) => this.maxTemperature.push(Math.max(...forecast.temperature)));
  }

  getAverage(array: number[]): number{
    let sum = 0;
    array.forEach((element) => sum += element);
    return sum / array.length;
  }

  downloadAdvancedData(i: number) {
    this.showAdvancedForecast = true;
    this.forecastService.getAdvancedWeatherData(this.lat!, this.lng!, this.days!).subscribe({
      next: (res) => {
        this.advancedForecast.pressure = res.hourly.surface_pressure.slice(i * 24, (i + 1) * 24);
        this.advancedForecast.rain = res.hourly.rain.slice(i * 24, (i + 1) * 24);
        this.advancedForecast.snowfall = res.hourly.snowfall.slice(i * 24, (i + 1) * 24);
        this.advancedForecast.visibility = res.hourly.visibility.slice(i * 24, (i + 1) * 24);
        this.advancedForecast.windspeed = res.hourly.windspeed_10m.slice(i * 24, (i + 1) * 24);
      },
      error: (err) => {
        alert("Wystąpił błąd nie pobrano danych");
      }
    });
  }
}

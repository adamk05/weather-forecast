import { Component, OnInit } from '@angular/core';
import { WeatherForecastService } from './weather-forecast.service';
import { DayForecast } from './DayForecast';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'weather-forecast';
  lat: number|null = null;
  lng: number|null = null;
  days: number|null = null;
  dailyForecast: DayForecast[] = [];
  city = "";

  constructor(private forecastService: WeatherForecastService) {}
  
  ngOnInit(): void {
    
  }

  submit(){
    this.forecastService.getCityLatLng(this.city).subscribe({
      next: (v) => {
        if(!v.results){
          alert("Nie znaleziono twojego miasta, wpisz inne");
          return;
        }
        this.forecastService.getBaseWeatherData(v.results[0].latitude, v.results[0].longitude, this.days!).subscribe({
          next: (res) => {
            for(let i = 0; i < this.days! * 24 - 1; i += 24){
              let dayForecast = new DayForecast();
              dayForecast.temperature = res.hourly.temperature_2m.slice(i, i + 24);
              dayForecast.precipitation = res.hourly.precipitation.slice(i, i + 24);
              dayForecast.cloudcover = res.hourly.cloudcover.slice(i, i + 24);
              this.dailyForecast.push(dayForecast);
            }
          },
          error: (e) => alert("Wystąpił błąd, nie pobrano danych")
        });
      },
      error: (e) => alert("Wystąpił błąd, nie pobrano danych")
    });
  }

}

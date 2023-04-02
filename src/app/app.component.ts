import { Component, OnInit } from '@angular/core';
import { WeatherForecastService } from './weather-forecast.service';

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

  constructor(private forecastService: WeatherForecastService) {}
  
  ngOnInit(): void {
    //testy metod z serwisu - działają
    this.lat = 50.32;
    this.lng = 18.79;
    this.days = 2;
    this.forecastService.getBaseWeatherData(this.lat, this.lng, this.days).subscribe((res) => {
      console.log(res);
    });
    this.forecastService.getAdvancedWeatherData(this.lat, this.lng, this.days).subscribe((res) => {
      console.log(res);
    })
  }
}

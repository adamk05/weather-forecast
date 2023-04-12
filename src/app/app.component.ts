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
  city = "";

  constructor(private forecastService: WeatherForecastService) {}
  
  ngOnInit(): void {
  }

  submit(){
    this.forecastService.getCityLatLng(this.city).subscribe((res) => {
      if(!res.results){
        console.log("brak wynikow");
      }
      else{
        this.lat = res.results[0].latitude;
        this.lng = res.results[0].longitude;
        this.forecastService.getBaseWeatherData(this.lat!, this.lng!, this.days!).subscribe((forecastRes) => {
          console.log(forecastRes);
        })
      }
    });
  }

}

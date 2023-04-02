import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherForecastService {

  baseURL = 'https://api.open-meteo.com/v1/forecast?';

  constructor(private http: HttpClient) { }

  getBaseWeatherData(lat: number, lng: number, days: number): Observable<any> {
    return this.http.get<any> (this.baseURL + 'latitude=' + lat.toString() + '&longitude=' + lng.toString() + '&hourly=temperature_2m,precipitation,cloudcover&forecast_days=' + days.toString());
  }

  getAdvancedWeatherData(lat: number, lng: number, days: number): Observable<any> {
    return this.http.get<any> (this.baseURL + 'latitude=' + lat.toString() + '&longitude=' + lng.toString() + '&hourly=temperature_2m,precipitation,rain,showers,snowfall,surface_pressure,cloudcover,visibility,windspeed_10m&forecast_days=' + days.toString());
  }
}

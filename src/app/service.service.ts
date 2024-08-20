import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private apiUrl = 'https://api.openweathermap.org/data/2.5';
  private apiKey = 'f93283782d740ce402b58a946da80b78';  // Replace with your OpenWeatherMap API key

  constructor(private http: HttpClient) {}

  getCurrentWeatherByCity(city: string): Observable<any> {
    const url = `${this.apiUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric`;
    return this.http.get<any>(url);
  }

  getForecastByCity(city: string): Observable<any> {
    const url = `${this.apiUrl}/forecast?q=${city}&appid=${this.apiKey}&units=metric`;
    return this.http.get<any>(url);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  AdminDistrictMatching,
  HistDistrictMatching,
  HousePricePredictionData,
  StreetMatching,
  WallMatching,
} from './models/models';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private baseUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {}

  postPricePrediction(
    data: HousePricePredictionData
  ): Observable<any> {
    return this.http.post<HousePricePredictionData>(
      `${this.baseUrl}/predict`,
      data
    );
  }

  getHistoryDistricts() {
    return this.http.get<HistDistrictMatching[]>(
      `${this.baseUrl}/hist_districts`
    );
  }

  getAdminDistricts() {
    return this.http.get<AdminDistrictMatching[]>(
      `${this.baseUrl}/admin_districts`
    );
  }

  getStreets() {
    return this.http.get<StreetMatching[]>(`${this.baseUrl}/streets`);
  }

  getWalls() {
    return this.http.get<WallMatching[]>(`${this.baseUrl}/walls`);
  }
}

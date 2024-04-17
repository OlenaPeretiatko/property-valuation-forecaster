import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MonoTypeOperatorFunction, Observable, map, of } from 'rxjs';
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
  pipe(arg0: MonoTypeOperatorFunction<unknown>) {
    throw new Error('Method not implemented.');
  }
  private baseUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {}

  postPricePrediction(data: HousePricePredictionData): Observable<any> {
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

  getCities() {
    return of([
      { id: 1, city: 'Cherkasy' },
      { id: 2, city: 'Chernihiv' },
      { id: 3, city: 'Chernivtsi' },
      { id: 4, city: 'Dnipropetrovsk' },
      { id: 5, city: 'Donetsk' },
      { id: 6, city: 'Ivano-Frankivsk' },
      { id: 7, city: 'Kharkiv' },
      { id: 8, city: 'Kherson' },
      { id: 9, city: 'Khmelnytskyi' },
      { id: 10, city: 'Kyiv' },
      { id: 11, city: 'Kirovohrad' },
      { id: 12, city: 'Luhansk' },
      { id: 13, city: 'Lviv' },
      { id: 14, city: 'Mykolaiv' },
      { id: 15, city: 'Odessa' },
      { id: 16, city: 'Poltava' },
      { id: 17, city: 'Rivne' },
      { id: 18, city: 'Sumy' },
      { id: 19, city: 'Ternopil' },
      { id: 20, city: 'Vinnytsia' },
      { id: 21, city: 'Volyn (Lutsk)' },
      { id: 22, city: 'Zakarpattia' },
      { id: 23, city: 'Zaporizhia' },
      { id: 24, city: 'Zhytomyr' },
    ]);
  }

  getSoldPrice() {
    return of([
      {
        id: 1,
        label: 'January',
        price: 90000,
      },
      {
        id: 2,
        label: 'February',
        price: 91000,
      },
      {
        id: 3,
        label: 'March',
        price: 91200,
      },
      {
        id: 4,
        label: 'April',
        price: 93000,
      },
      {
        id: 5,
        label: 'May',
        price: 91900,
      },
      {
        id: 6,
        label: 'June',
        price: 95000,
      },
      {
        id: 7,
        label: 'July',
        price: 96000,
      },
      {
        id: 8,
        label: 'August',
        price: 94000,
      },
      {
        id: 9,
        label: 'September',
        price: 98000,
      },
      {
        id: 10,
        label: 'October',
        price: 99000,
      },
      {
        id: 11,
        label: 'November',
        price: 100000,
      },
      {
        id: 12,
        label: 'December',
        price: 101000,
      },
      {
        id: 1,
        label: 'January',
        price: 102000,
      },
    ]);
  }

  getNeighborhoodPrice() {
    return of([
      {
        id: 1,
        label: 'Neighborhood 1',
        price: 90000,
      },
      {
        id: 2,
        label: 'Neighborhood 2',
        price: 91000,
      },
      {
        id: 3,
        label: 'Neighborhood 3',
        price: 90200,
      },
      {
        id: 4,
        label: 'Neighborhood 4',
        price: 91400,
      },
      {
        id: 5,
        label: 'Neighborhood 5',
        price: 91000,
      },
      {
        id: 6,
        label: 'Neighborhood 6',
        price: 91500,
      },
    ]);
  }

  getStreets() {
    return this.http.get<StreetMatching[]>(`${this.baseUrl}/streets`);
  }

  getWalls() {
    return this.http.get<WallMatching[]>(`${this.baseUrl}/walls`);
  }
}

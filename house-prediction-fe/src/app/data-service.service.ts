import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { HousePricePredictionData } from './models/models';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private baseUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {}

  postPricePrediction(data: HousePricePredictionData): Observable<any> {
    return this.http.post<HousePricePredictionData>(
      `${this.baseUrl}/predict`,
      data
    );
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

  getCities() {
    return this.http.get<{ id: number; name: string }[]>(
      `${this.baseUrl}/cities`
    );
  }

  getDistricts() {
    return this.http.get<{ id: number; name: string; nameEn: string }[]>(
      `${this.baseUrl}/districts`
    );
  }

  getFurnishing() {
    return this.http.get<{ id: number; name: string }[]>(
      `${this.baseUrl}/furnishing`
    );
  }

  getPropertyTypes() {
    return this.http.get<{ id: number; name: string }[]>(
      `${this.baseUrl}/property_type`
    );
  }
}

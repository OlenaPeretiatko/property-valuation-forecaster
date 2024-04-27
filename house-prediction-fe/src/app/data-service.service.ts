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

  postPricePrediction(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/predict`,
      data
    );
  }

  getSoldPrice(): Observable<{ id: string; label: string; price: number }[]> {
    return this.http.get<{ id: string; label: string; price: number }[]>(
      `${this.baseUrl}/sold_price`
    );
  }

  getNeighborhoodPrice(): Observable<
    {
      id: string;
      label: string;
      price: number;
    }[]
  > {
    return this.http.get<{ id: string; label: string; price: number }[]>(
      `${this.baseUrl}/neighborhood_price`
    );
  }

  getHouseCountByPriceRange(): Observable<
    {
      id: string;
      label: string;
      value: number;
    }[]
  > {
    return this.http.get<{ id: string; label: string; value: number }[]>(
      `${this.baseUrl}/house_count_by_price_range`
    );
  }

  getFeatureImportance(): Observable<
    {
      id: string;
      label: string;
      value: number;
    }[]
  > {
    return this.http.get<{ id: string; label: string; value: number }[]>(
      `${this.baseUrl}/feature_importance`
    );
  }

  getCities() {
    return this.http.get<{ id: number; name: string }[]>(
      `${this.baseUrl}/cities`
    );
  }

  getDistricts() {
    return this.http.get<{
      city: string;
      districts: { id: number; name: string, nameEn: string }[];
    }[]>(
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

  getHousingTypes() {
    return this.http.get<{ id: number; name: string }[]>(
      `${this.baseUrl}/housing_type`
    );
  }

  getReparation() {
    return this.http.get<{ id: number; name: string }[]>(
      `${this.baseUrl}/reparation`
    );
  }
}

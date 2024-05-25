import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { HousePricePredictionData } from './models/models';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private baseUrl = 'https://house-pred-be.azurewebsites.net';

  constructor(private http: HttpClient) {}

  postPricePrediction(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/predict`, data);
  }

  getSoldPrice(
    cityCode: number
  ): Observable<{ id: string; label: string; price: number }[]> {
    let params = new HttpParams().set('city_code', cityCode.toString());

    return this.http.get<{ id: string; label: string; price: number }[]>(
      `${this.baseUrl}/sold_price`,
      { params }
    );
  }

  getNeighborhoodPrice(cityCode: number): Observable<
    {
      id: string;
      label: string;
      price: number;
    }[]
  > {
    let params = new HttpParams().set('city_code', cityCode.toString());

    return this.http.get<{ id: string; label: string; price: number }[]>(
      `${this.baseUrl}/neighborhood_price`,
      { params }
    );
  }

  getHouseCountByPriceRange(cityCode: number): Observable<
    {
      id: string;
      label: string;
      value: number;
    }[]
  > {
    let params = new HttpParams().set('city_code', cityCode.toString());

    return this.http.get<{ id: string; label: string; value: number }[]>(
      `${this.baseUrl}/house_count_by_price_range`,
      { params }
    );
  }

  getFeatureImportance(cityCode: number): Observable<
    {
      id: string;
      label: string;
      value: number;
    }[]
  > {
    let params = new HttpParams().set('city_code', cityCode.toString());

    return this.http.get<{ id: string; label: string; value: number }[]>(
      `${this.baseUrl}/feature_importance`,
      { params }
    );
  }

  getCities() {
    return this.http.get<{ id: number; name: string }[]>(
      `${this.baseUrl}/cities`
    );
  }

  getDistricts() {
    return this.http.get<
      {
        city: string;
        districts: { id: number; name: string; nameEn: string }[];
      }[]
    >(`${this.baseUrl}/districts`);
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

export interface HistDistrictMatching {
  hist_district_id: number;
  hist_district_name: string;
}

export interface AdminDistrictMatching {
  admin_district_id: number;
  admin_district_name: string;
}

export interface StreetMatching {
  street_id: number;
  street_name: string;
}

export interface WallMatching {
  wall_id: number;
  wall_name: string;
}

export interface HousePricePredictionData {
  admin_district: number | null;
  hist_district: number | null;
  street: number | null;
  wall: number | null;
  area_total: number | null;
  rooms: number | null;
}

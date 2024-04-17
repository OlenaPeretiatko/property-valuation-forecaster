import { StreetMatching, WallMatching } from '../../models/models';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data-service.service';
import { HistDistrictMatching, AdminDistrictMatching } from '../../models/models';

@Component({
  selector: 'app-price-prediction-form',
  templateUrl: './price-prediction-form.component.html',
  styleUrls: ['./price-prediction-form.component.scss'],
})
export class PricePredictionFormComponent implements OnInit {
  adminDistricts?: AdminDistrictMatching[];
  histDistricts?: HistDistrictMatching[];
  streets?: StreetMatching[];
  walls?: WallMatching[];
  prediction?: number;

  housePricePredData = {
    admin_district: null,
    hist_district: null,
    street: null,
    wall: null,
    area_total: null,
    rooms: null,
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getAdminDistricts().subscribe((data) => {
      this.adminDistricts = data;
    });

    this.dataService.getHistoryDistricts().subscribe((data) => {
      this.histDistricts = data;
    });

    this.dataService.getStreets().subscribe((data) => {
      this.streets = data;
    });

    this.dataService.getWalls().subscribe((data) => {
      this.walls = data;
    });
  }

  onSubmit() {
    this.dataService
      .postPricePrediction(this.housePricePredData)
      .subscribe((response) => (this.prediction = response.prediction));
  }
}

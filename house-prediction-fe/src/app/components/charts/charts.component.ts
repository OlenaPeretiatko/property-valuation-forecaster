import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/data-service.service';

@Component({
  selector: 'charts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgChartsModule,
  ],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss',
})
export class ChartsComponent implements OnInit {
  selectedCity!: number;
  cities?: { id: number; city: string }[];

  lineChartLabels: string[] = [];
  lineChartDatasets: ChartConfiguration<'line'>['data']['datasets'] = [
    {
      data: [], // Example data for average sold price
      label: 'Average Sold Price $',
      fill: true,
      tension: 0.5,
      borderColor: '#000',
      backgroundColor: 'rgba(108, 208, 245, 0.5)', // Light blue background color
    },
  ];

  barChartLabels: string[] = [];
  barChartDatasets: ChartConfiguration<'bar'>['data']['datasets'] = [
    {
      data: [],
      label: 'Average Price',
      backgroundColor: ['#D3D3D3', '#1E90FF'],
    },
  ];

  doughnutChartLabels: string[] = [];
  doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [
    {
      data: [],
      backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6610f2'], // Different colors for each segment
    },
  ];

  radarChartLabels: string[] = [];
  radarChartDatasets: ChartConfiguration<'radar'>['data']['datasets'] = [
    {
      label: 'Feature Importance',
      data: [],
      backgroundColor: 'rgba(0, 123, 255, 0.2)',
      borderColor: '#007bff',
      pointBackgroundColor: '#007bff',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#007bff',
    },
  ];

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(private _dataService: DataService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this._dataService
        .getCities()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((cities) => {
          this.cities = cities.map((el) => ({ id: el.id, city: el.name }));
          this.selectedCity = this.cities[0].id;
          console.log(this.selectedCity)

          this.loadAllCharts();
        });
    }, 0);
  }

  loadAllCharts() {
    this.loadLineChartData();
    this.loadBarChartData();
    this.loadDoughnutChartData();
    this.loadRadarChartDataChartData();
  }

  private loadLineChartData() {
    this._dataService
      .getSoldPrice(this.selectedCity)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.lineChartLabels = data.map((el) => el.label);
        this.lineChartDatasets[0].data = data.map((el) => el.price);
      });
  }

  private loadBarChartData() {
    this._dataService
      .getNeighborhoodPrice(this.selectedCity)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.barChartLabels = data.map((el) => el.label);
        this.barChartDatasets[0].data = data.map((el) => el.price);
      });
  }

  private loadDoughnutChartData() {
    this._dataService
      .getHouseCountByPriceRange(this.selectedCity)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.doughnutChartLabels = data.map((el) => el.label);
        this.doughnutChartDatasets[0].data = data.map((el) => el.value);
      });
  }

  private loadRadarChartDataChartData() {
    this._dataService
      .getFeatureImportance(this.selectedCity)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.radarChartLabels = data.map((el) => el.label);
        this.radarChartDatasets[0].data = data.map((el) => el.value);
      });
  }
}

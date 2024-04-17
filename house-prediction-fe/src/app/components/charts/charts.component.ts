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
  selectedCity?: { id: number; city: string };
  cities?: { id: number; city: string }[];

  //line
  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [], // Example data for average sold price
        label: 'Average Sold Price $',
        fill: true,
        tension: 0.5,
        borderColor: '#000',
        backgroundColor: 'rgba(108, 208, 245, 0.5)', // Light blue background color
      },
    ],
  };

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Average Price',
        backgroundColor: ['#D3D3D3', '#1E90FF'],
      },
    ],
  };

  //doughnut
  doughnutChartLabels: string[] = [
    '< $200k',
    '$200k - $300k',
    '$300k - $400k',
    '$400k - $500k',
    '> $500k',
  ];
  doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [
    {
      data: [20, 30, 25, 15, 10], // Example distribution percentages
      backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6610f2'], // Different colors for each segment
    },
  ];

  //radar

  radarChartLabels = [
    'Location',
    'Size',
    'Age',
    'Amenities',
    'Schools',
    'Transport',
  ];
  radarChartData: ChartConfiguration<'radar'>['data']['datasets'] = [
    {
      label: 'Feature Importance',
      data: [80, 70, 60, 85, 75, 65],
      backgroundColor: 'rgba(0, 123, 255, 0.2)',
      borderColor: '#007bff',
      pointBackgroundColor: '#007bff',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#007bff',
    },
  ];
  radarChartOptions: ChartConfiguration<'radar'>['options'] = {
    responsive: false,
  };

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(private _dataService: DataService) {}

  ngOnInit(): void {
    this._dataService
      .getCities()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((cities) => {
        this.cities = cities;
      });

    this.loadLineChartData();
    this.loadBarChartData();
  }

  private loadLineChartData() {
    this._dataService
      .getSoldPrice()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.lineChartData.labels = data.map((el) => el.label);
        this.lineChartData.datasets[0].data = data.map((el) => el.price);
      });
  }

  private loadBarChartData() {
    this._dataService
      .getNeighborhoodPrice()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.barChartData.labels = data.map((el) => el.label);
        this.barChartData.datasets[0].data = data.map((el) => el.price);
      });
  }
}

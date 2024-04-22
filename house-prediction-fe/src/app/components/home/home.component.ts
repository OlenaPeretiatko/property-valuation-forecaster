import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PredictionFormComponent } from '../prediction-form/prediction-form.component';
import { ChartsComponent } from '../charts/charts.component';
import { AboutComponent } from '../about/about.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    PredictionFormComponent,
    ChartsComponent,
    AboutComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  address: string = '';

  ngOnInit(): void {}

  predictPrice() {
    // Logic to handle the price prediction
    console.log('Predicting price for:', this.address);
  }
}

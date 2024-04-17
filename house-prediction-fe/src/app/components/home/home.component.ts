import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import * as L from 'leaflet';
import { PredictionFormComponent } from '../prediction-form/prediction-form.component';
import { ChartsComponent } from '../charts/charts.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    PredictionFormComponent,
    ChartsComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  address: string = '';

  map?: L.Map;
  marker?: L.Marker;

  ngOnInit(): void {
    this.map = L.map('map').setView([49.8397, 24.0297], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      console.log(e.latlng);
      if (this.marker) {
        this.map?.removeLayer(this.marker); // Remove existing marker
      }
      if (this.map) {
        this.marker = L.marker(e.latlng, {
          icon: L.icon({
            iconUrl: 'assets/marker-icon.png',
            iconRetinaUrl: 'assets/marker-icon-2x.png',
            shadowUrl: 'assets/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [41, 41],
          }),
        }).addTo(this.map);
      }
    });
  }

  predictPrice() {
    // Logic to handle the price prediction
    console.log('Predicting price for:', this.address);
  }
}

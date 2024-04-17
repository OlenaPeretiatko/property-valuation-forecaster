import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChartsComponent } from '../charts/charts.component';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, ChartsComponent],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss'
})
export class FeaturesComponent {

}

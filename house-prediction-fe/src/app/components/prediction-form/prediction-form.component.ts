import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DataService } from 'src/app/data-service.service';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { debounceTime, switchMap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

interface CategoryDetails {
  categoryName: string;
  icon: string;
  count: number;
  placesNearby: string[];
}

interface Score {
  schools: CategoryDetails;
  hospitals: CategoryDetails;
  kindergartens: CategoryDetails;
  shopping_centers: CategoryDetails;
  cafes: CategoryDetails;
  park_areas: CategoryDetails;
  transport_interchanges: CategoryDetails;
}

@Component({
  selector: 'prediction-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './prediction-form.component.html',
  styleUrl: './prediction-form.component.scss',
})
export class PredictionFormComponent implements OnInit {
  map?: L.Map;
  marker?: L.Marker;

  cities: { id: number; name: string }[] = [];
  districts: { id: number; name: string; nameEn: string }[] = [];
  furnishing: { id: number; name: string }[] = [];
  propertyTypes: { id: number; name: string }[] = [];
  prediction?: number;

  addresses: any[] = [];

  pricePredictionForm = new FormGroup({
    address: new FormControl<string | null>(null),
    city_code: new FormControl<number | null>(null),
    district_code: new FormControl<number | null>(null),
    furnishing_code: new FormControl<number | null>(null),
    floor: new FormControl<number | null>(null),
    total_area: new FormControl<number | null>(null),
    kitchen_area: new FormControl<number | null>(null),
    rooms_number: new FormControl<number | null>(null),
    amenities_score: new FormControl<number | null>(null),
    education_score: new FormControl<number | null>(null),
    transportation_score: new FormControl<number | null>(null),
  });

  score: Score = {
    schools: {
      categoryName: 'Schools',
      icon: 'school', // Material icon for school
      count: 0,
      placesNearby: [],
    },
    hospitals: {
      categoryName: 'Hospitals',
      icon: 'local_hospital', // Material icon for hospitals
      count: 0,
      placesNearby: [],
    },
    kindergartens: {
      categoryName: 'Kindergartens',
      icon: 'child_care', // Material icon for childcare
      count: 0,
      placesNearby: [],
    },
    shopping_centers: {
      categoryName: 'Grocery, Shopping Centers',
      icon: 'shopping_cart', // Material icon for shopping
      count: 0,
      placesNearby: [],
    },
    cafes: {
      categoryName: 'Cafes, Restaurants',
      icon: 'shopping_cart', // Material icon for shopping
      count: 0,
      placesNearby: [],
    },
    park_areas: {
      categoryName: 'Park Areas',
      icon: 'nature_people', // Material icon for parks
      count: 0,
      placesNearby: [],
    },
    transport_interchanges: {
      categoryName: 'Transport Interchanges',
      icon: 'directions_bus', // Material icon for bus stations
      count: 0,
      placesNearby: [],
    },
  };

  constructor(private dataService: DataService, private http: HttpClient) {}

  ngOnInit() {
    // Loading data for selects
    this.loadDataForSelects();

    // Map initialization
    this.map = L.map('map').setView([49.8397, 24.0297], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
    this.map?.on('click', (e: L.LeafletMouseEvent) => {
      this.onMapClick(e.latlng.lat.toString(), e.latlng.lng.toString());
    });

    // Address value changes
    this.pricePredictionForm.controls.address.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((value) => this.searchAddress(value ?? ''))
      )
      .subscribe((data) => {
        console.log(data);
        this.addresses = data; // Handle the response data here
      });
  }

  onAddressSelected(e: any) {
    console.log(e);
    const selectedAddress = e.option.value;
    console.log('Selected Address:', selectedAddress.display_name);
    this.pricePredictionForm.controls.address.setValue(
      selectedAddress.display_name,
      { emitEvent: false }
    );
    console.log(
      'Coordinates: Lat',
      selectedAddress.lat,
      'Lon',
      selectedAddress.lon
    );
    this.onMapClick(selectedAddress.lat, selectedAddress.lon);
  }
  private onMapClick(lat: string, lon: string) {
    if (this.marker) {
      this.map?.removeLayer(this.marker); // Remove existing marker
    }
    if (this.map) {
      this.marker = L.marker([parseFloat(lat), parseFloat(lon)], {
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
    this.geocode(lat, lon);
    this.findNearby(lat, lon, 'amenity');
    this.findNearby(lat, lon, 'education');
    this.findNearby(lat, lon, 'transportation');

    this.getNearbyForDisplay(lat, lon);
  }

  private searchAddress(query: string) {
    query += ', Lviv';
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=UA&q=${encodeURIComponent(
      query
    )}`;
    return this.http.get<any[]>(url);
  }

  private findNearby(
    lat: string,
    lon: string,
    type: 'amenity' | 'education' | 'transportation'
  ) {
    let query = '';

    switch (type) {
      case 'amenity':
        query = `[out:json]; node(around:700, ${lat}, ${lon})[amenity]; out;`;
        break;

      case 'education':
        query = `
          [out:json];
          (
            node(around:700, ${lat}, ${lon})[amenity=school];
            node(around:700, ${lat}, ${lon})[amenity=college];
            node(around:700, ${lat}, ${lon})[amenity=university];
          );
          out;
        `;
        break;

      case 'transportation':
        query = `
          [out:json];
          (
            node(around:700, ${lat}, ${lon})[highway=bus_stop];
            node(around:700, ${lat}, ${lon})[railway=station];
          );
          out;
        `;
        break;
      // Add more cases as needed
    }

    this.http
      .get(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
          query
        )}`
      )
      .subscribe(
        (response: any) => {
          const elements = response.elements;
          console.log(
            `Found ${elements.length} ${type} points nearby:`,
            elements
          );
          // Process the response and update the UI accordingly
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  getNearbyForDisplay(lat: string, lon: string) {
    const query = `
    [out:json];
    (
      node(around:700, ${lat}, ${lon})["amenity"="school"];
      node(around:700, ${lat}, ${lon})["amenity"="hospital"];
      node(around:700, ${lat}, ${lon})["amenity"="kindergarten"];
      node(around:700, ${lat}, ${lon})["shop"~"mall|convenience|supermarket|greengrocer|deli"];
      node(around:700, ${lat}, ${lon})["leisure"~"park|playground|recreation_ground|dog_park"];
      node(around:700, ${lat}, ${lon})["public_transport"="platform"];
      node(around:700, ${lat}, ${lon})["amenity"~"restaurant|cafe"];
    );
    out;
  `;

    this.http
      .get(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
          query
        )}`
      )
      .subscribe(
        (response: any) => {
          console.log(response);
          const elements = response.elements;

          this.processPOIs(elements, 'schools', 'amenity', 'school');
          this.processPOIs(elements, 'hospitals', 'amenity', 'hospital');
          this.processPOIs(
            elements,
            'kindergartens',
            'amenity',
            'kindergarten'
          );
          this.processPOIs(
            elements,
            'shopping_centers',
            'shop',
            'mall',
            'convenience',
            'supermarket',
            'greengrocer',
            'deli'
          );
          this.processPOIs(elements, 'cafes', 'amenity', 'restaurant', 'cafe');
          this.processPOIs(
            elements,
            'park_areas',
            'leisure',
            'park',
            'playground',
            'recreation_ground',
            'dog_park'
          );
          this.processPOIs(
            elements,
            'transport_interchanges',
            'public_transport',
            'platform'
          );

          console.log('Score object updated with nearby POIs:', this.score);
          // You can now display both the count and the names in your UI
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  processPOIs(
    elements: any[],
    property: string,
    tagKey: string,
    ...tagValues: string[]
  ) {
    const filteredElements = elements.filter((el: any) =>
      tagValues.includes(el.tags[tagKey])
    );
    const uniqueFilteredElements = Array.from(new Set(filteredElements));

    (this.score as any)[property] = {
      ...(this.score as any)[property],

      count: Array.from(
        new Set(filteredElements.map((el) => el.tags.name || null))
      ).filter((name) => name != null).length,
      placesNearby: Array.from(
        new Set(filteredElements.map((el) => el.tags.name || null))
      )
        .filter((name) => name != null)
        .splice(0, 6),
    };
  }

  geocode(lat: string, lon: string) {
    const language = 'ua';
    // Use a geocoding service to get street and city information
    const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&lang=${language}`;

    fetch(geocodeUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log('Geocode result:', data);
        const district = data.address.borough.split(' District')[0];
        console.log('DISTRICT', district);
        this.districts.map((el) => console.log(el.nameEn));
        console.log(this.districts.find((el) => el.nameEn === district));
        const districtCode =
          this.districts.find((el) => el.nameEn === district)?.id || null;
        console.log(districtCode);
        // console.log(data.address.borough, reverseTransliterate(data.address.borough))

        this.pricePredictionForm.controls.district_code.setValue(districtCode);
        this.pricePredictionForm.controls.address.setValue(data.display_name);
      })
      .catch((error) => console.error('Geocode error:', error));
  }

  loadDataForSelects() {
    this.dataService.getCities().subscribe((data) => {
      this.cities = data;
    });

    this.dataService.getDistricts().subscribe((data) => {
      this.districts = data;
    });

    this.dataService.getFurnishing().subscribe((data) => {
      this.furnishing = data;
    });

    this.dataService.getPropertyTypes().subscribe((data) => {
      this.propertyTypes = data;
    });
  }

  onSubmit() {
    const data = '';
    // this.dataService
    //   .postPricePrediction(data)
    //   .subscribe((response) => (this.prediction = response.prediction));
  }
}

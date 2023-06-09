import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricePredictionFormComponent } from './price-prediction-form.component';

describe('PricePredictionFormComponent', () => {
  let component: PricePredictionFormComponent;
  let fixture: ComponentFixture<PricePredictionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricePredictionFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricePredictionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

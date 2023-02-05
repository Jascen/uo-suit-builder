import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyRangeControlComponent } from './property-range-control.component';

describe('PropertyRangeControlComponent', () => {
  let component: PropertyRangeControlComponent;
  let fixture: ComponentFixture<PropertyRangeControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyRangeControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyRangeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

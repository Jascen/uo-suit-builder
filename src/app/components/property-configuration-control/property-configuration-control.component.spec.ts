import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyConfigurationControlComponent } from './property-configuration-control.component';

describe('PropertyConfigurationControlComponent', () => {
  let component: PropertyConfigurationControlComponent;
  let fixture: ComponentFixture<PropertyConfigurationControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyConfigurationControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyConfigurationControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyConfigurationFormComponent } from './property-configuration-form.component';

describe('PropertyConfigurationFormComponent', () => {
  let component: PropertyConfigurationFormComponent;
  let fixture: ComponentFixture<PropertyConfigurationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyConfigurationFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyConfigurationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

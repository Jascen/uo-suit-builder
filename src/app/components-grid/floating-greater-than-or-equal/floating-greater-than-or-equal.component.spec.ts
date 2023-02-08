import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingGreaterThanOrEqualComponent } from './floating-greater-than-or-equal.component';

describe('FloatingGreaterThanOrEqualComponent', () => {
  let component: FloatingGreaterThanOrEqualComponent;
  let fixture: ComponentFixture<FloatingGreaterThanOrEqualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloatingGreaterThanOrEqualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingGreaterThanOrEqualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

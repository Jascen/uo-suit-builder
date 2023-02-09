import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuitSummaryComponent } from './suit-summary.component';

describe('SuitSummaryComponent', () => {
  let component: SuitSummaryComponent;
  let fixture: ComponentFixture<SuitSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuitSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuitSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

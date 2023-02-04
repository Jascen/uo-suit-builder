import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildRequestSummaryDialogComponent } from './build-request-summary-dialog.component';

describe('BuildRequestSummaryDialogComponent', () => {
  let component: BuildRequestSummaryDialogComponent;
  let fixture: ComponentFixture<BuildRequestSummaryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildRequestSummaryDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildRequestSummaryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuitConfigComponent } from './suit-config.component';

describe('SuitConfigComponent', () => {
  let component: SuitConfigComponent;
  let fixture: ComponentFixture<SuitConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuitConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuitConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

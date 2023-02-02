import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuitBuilderComponent } from './suit-builder.component';

describe('SuitBuilderComponent', () => {
  let component: SuitBuilderComponent;
  let fixture: ComponentFixture<SuitBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuitBuilderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuitBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

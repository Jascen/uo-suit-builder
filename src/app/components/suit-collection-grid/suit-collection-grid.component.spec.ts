import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuitCollectionGridComponent } from './suit-collection-grid.component';

describe('SuitCollectionGridComponent', () => {
  let component: SuitCollectionGridComponent;
  let fixture: ComponentFixture<SuitCollectionGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuitCollectionGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuitCollectionGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

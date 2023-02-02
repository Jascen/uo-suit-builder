import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuitCollectionComponent } from './suit-collection.component';

describe('SuitCollectionComponent', () => {
  let component: SuitCollectionComponent;
  let fixture: ComponentFixture<SuitCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuitCollectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuitCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

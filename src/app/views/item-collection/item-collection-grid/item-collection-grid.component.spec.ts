import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCollectionGridComponent } from './item-collection-grid.component';

describe('ItemCollectionGridComponent', () => {
  let component: ItemCollectionGridComponent;
  let fixture: ComponentFixture<ItemCollectionGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemCollectionGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemCollectionGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCollectionComponent } from './item-collection.component';

describe('ItemCollectionComponent', () => {
  let component: ItemCollectionComponent;
  let fixture: ComponentFixture<ItemCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemCollectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

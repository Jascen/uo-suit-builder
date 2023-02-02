import { ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllSuits } from 'src/app/state/selectors/suit-builder.selectors';
import { selectAllPropertyEntities } from 'src/app/state/selectors/suit-config.selectors';
import { SuitCollectionGridComponent } from './suit-collection-grid/suit-collection-grid.component';


@Component({
  selector: 'app-suit-collection',
  templateUrl: './suit-collection.component.html',
  styleUrls: ['./suit-collection.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuitCollectionComponent {
  @ViewChild(SuitCollectionGridComponent, { static: true }) gridComponent!: SuitCollectionGridComponent;

  readonly suits$ = this.store.select(selectAllSuits);
  readonly properties$ = this.store.select(selectAllPropertyEntities);

  constructor(private store: Store) { }

}

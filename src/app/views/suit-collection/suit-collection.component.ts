import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllFilterableProperties, selectAllProperties } from 'src/app/state/selectors/suit-config.selectors';
import { SuitCollectionGridComponent } from '../../components/suit-collection-grid/suit-collection-grid.component';
import { selectActiveSuit, selectAllSuits, selectGridFilter } from 'src/app/state/selectors/suit-collection.selectors';
import * as suitCollectionActions from '../../state/actions/suit-collection.actions';


@Component({
  selector: 'app-suit-collection',
  templateUrl: './suit-collection.component.html',
  styleUrls: ['./suit-collection.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuitCollectionComponent implements OnDestroy {
  @ViewChild(SuitCollectionGridComponent, { static: true }) gridComponent!: SuitCollectionGridComponent;

  readonly suits$ = this.store.select(selectAllSuits);
  readonly selectedSuit$ = this.store.select(selectActiveSuit);
  readonly properties$ = this.store.select(selectAllProperties);
  readonly filteredProperties$ = this.store.select(selectAllFilterableProperties);
  readonly gridFilter$ = this.store.select(selectGridFilter);

  onSuitSelected(suitId: string) {
    this.store.dispatch(suitCollectionActions.UserActions.selectSuit({ suitId }));
  }

  onFilterChanged(gridFilter: {}) {
    this.store.dispatch(suitCollectionActions.UserActions.updateGridFilter({ gridFilter }));
  }

  constructor(private store: Store) { }

  ngOnDestroy(): void {
    this.store.dispatch(suitCollectionActions.UserActions.selectSuit({ suitId: null }));
  }

}

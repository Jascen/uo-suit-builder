import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectActiveItemIds, selectAllItemsIgnoreBaseline, selectBaselineSuit } from 'src/app/state/selectors/item-collection.selectors';
import { selectAllProperties } from 'src/app/state/selectors/suit-config.selectors';
import { Papa } from 'ngx-papaparse';
import * as itemCollectionActions from '../../state/actions/item-collection.actions'
import { ItemCollectionGridComponent } from 'src/app/components/item-collection-grid/item-collection-grid.component';
import { GridApi, RowDropZoneParams } from 'ag-grid-community';


@Component({
  selector: 'app-item-collection',
  templateUrl: './item-collection.component.html',
  styleUrls: ['./item-collection.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemCollectionComponent {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('dropZone', { static: false }) dropZone!: ElementRef<any>;
  @ViewChild(ItemCollectionGridComponent) itemCollectionGrid!: ItemCollectionGridComponent;

  readonly filteredItems$ = this.store.select(selectAllItemsIgnoreBaseline);
  readonly baselineSuit$ = this.store.select(selectBaselineSuit);
  readonly selectedIds$ = this.store.select(selectActiveItemIds);
  readonly properties$ = this.store.select(selectAllProperties);

  onFileSelected(files: FileList) {
    if (!files?.length) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const text: string = e.target.result;
        if (!text) return;

        const extension = file.name?.split('.')[1];
        switch (extension) {
          case 'json':
            this.store.dispatch(itemCollectionActions.UserActions.import({ items: JSON.parse(text) }))
            break;

          case 'csv':
            this.papa.parse(text, {
              header: true,
              dynamicTyping: true,
              complete: (results) => {
                this.store.dispatch(itemCollectionActions.UserActions.import({ items: results.data }))
              }
            });
            break;
        }
      } finally {
        if (this.fileInput?.nativeElement) {
          this.fileInput.nativeElement.value = "";
        }
      }
    }

    reader.readAsText(file);
  }

  onBaselineItemRemoved(itemId: number) {
    this.store.dispatch(itemCollectionActions.UserActions.removeBaselineItem({ itemId }));
  }

  onBuildClicked() {
    this.store.dispatch(itemCollectionActions.UserActions.build());
  }

  onSelectedRowsChanged(itemIds: number[]) {
    this.store.dispatch(itemCollectionActions.UserActions.selectItems({ itemIds }));
  }

  onItemGridInitialized(api: GridApi) {
    const dropZone: RowDropZoneParams = {
      getContainer: () => this.dropZone.nativeElement,
      onDragEnter: () => {
        this.dropZone.nativeElement.style.opacity = '0.21';
      },
      onDragLeave: () => {
        this.dropZone.nativeElement.style.opacity = '1.0';
      },
      onDragStop: (params) => {
        this.dropZone.nativeElement.style.opacity = '1.0';

        const data = params?.node?.data;
        if (!data || data.id == null) { return; }

        const rowsInGrid = !!api.getRowNode(data.id);
        if (rowsInGrid) {
          api.applyTransaction({ remove: [data] });
          this.store.dispatch(itemCollectionActions.UserActions.addBaselineItem({ itemId: data.id }));
        }
      }
    };

    api.addRowDropZone(dropZone);
  }

  constructor(
    private store: Store,
    private papa: Papa
  ) { }
}

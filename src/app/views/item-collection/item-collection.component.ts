import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectActiveItemIdss, selectAllItems } from 'src/app/state/selectors/item-collection.selectors';
import { selectAllProperties } from 'src/app/state/selectors/suit-config.selectors';
import { Papa } from 'ngx-papaparse';
import * as itemCollectionActions from '../../state/actions/item-collection.actions'


@Component({
  selector: 'app-item-collection',
  templateUrl: './item-collection.component.html',
  styleUrls: ['./item-collection.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemCollectionComponent {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  readonly items$ = this.store.select(selectAllItems);
  readonly selectedIds$ = this.store.select(selectActiveItemIdss);
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

  onBuildClicked() {
    this.store.dispatch(itemCollectionActions.UserActions.build());
  }

  onSelectedRowsChanged(itemIds: number[]) {
    this.store.dispatch(itemCollectionActions.UserActions.selectItems({ itemIds }));
  }

  constructor(
    private store: Store,
    private papa: Papa
  ) { }

}

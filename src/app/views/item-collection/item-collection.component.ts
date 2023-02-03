import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllItems } from 'src/app/state/selectors/item-collection.selectors';
import { selectAllProperties } from 'src/app/state/selectors/suit-config.selectors';
import * as itemCollectionActions from '../../state/actions/item-collection.actions'
import { ItemCollectionGridComponent } from './item-collection-grid/item-collection-grid.component';


@Component({
  selector: 'app-item-collection',
  templateUrl: './item-collection.component.html',
  styleUrls: ['./item-collection.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemCollectionComponent {
  @ViewChild('fileInput', { static: true }) fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild(ItemCollectionGridComponent, { static: true }) gridComponent!: ItemCollectionGridComponent;

  readonly items$ = this.store.select(selectAllItems);
  readonly properties$ = this.store.select(selectAllProperties);

  onFileSelected(event: any) {
    const files: FileList = event?.target?.files;
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
    const selectedItemIds = this.gridComponent.getSelected();
    this.store.dispatch(itemCollectionActions.UserActions.build({ itemIds: selectedItemIds }));
  }

  constructor(private store: Store) { }

}

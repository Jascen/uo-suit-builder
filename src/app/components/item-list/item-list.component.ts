import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { Item } from 'src/app/state/models/item-collection.models';
import { StatConfiguration } from 'src/app/state/models/suit-config.models';


@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemListComponent {

  @Input() items: Item[];
  @Input() properties: StatConfiguration[];

}

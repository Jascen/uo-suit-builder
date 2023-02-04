import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { StatConfiguration } from 'src/app/state/models/suit-config.models';

@Component({
  selector: 'app-item-detail-list',
  templateUrl: './item-detail-list.component.html',
  styleUrls: ['./item-detail-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemDetailListComponent {

  @Input() properties: StatConfiguration[];
  @Input() dataSource: Record<string, number>;

}

import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { StatConfiguration } from 'src/app/state/models/suit-config.models';

@Component({
  selector: 'app-detail-list',
  templateUrl: './detail-list.component.html',
  styleUrls: ['./detail-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailListComponent {

  @Input() properties: StatConfiguration[];
  @Input() dataSource: Record<string, number>;

}
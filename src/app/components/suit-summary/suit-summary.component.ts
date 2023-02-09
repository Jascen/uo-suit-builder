import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { Suit } from 'src/app/state/models/suit-collection.models';
import { StatConfiguration } from 'src/app/state/models/suit-config.models';


@Component({
  selector: 'app-suit-summary',
  templateUrl: './suit-summary.component.html',
  styleUrls: ['./suit-summary.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuitSummaryComponent {

  @Input() suit: Suit;
  @Input() properties: StatConfiguration[];
  @Input() canRemoveItems: boolean;

  @Output() itemRemoved = new EventEmitter<number>();

}

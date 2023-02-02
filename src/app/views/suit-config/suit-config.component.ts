import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromActions from '../../state/actions/suit-config.actions';


@Component({
  selector: 'app-suit-config',
  templateUrl: './suit-config.component.html',
  styleUrls: ['./suit-config.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuitConfigComponent implements OnInit {

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(fromActions.Actions.initialize())
  }

}

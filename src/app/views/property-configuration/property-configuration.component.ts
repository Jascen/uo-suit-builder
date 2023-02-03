import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { StatConfiguration } from 'src/app/state/models/suit-config.models';
import { selectActiveProperty, selectAllPropertiesSorted } from 'src/app/state/selectors/suit-config.selectors';
import * as suitConfigActions from '../../state/actions/suit-config.actions';

@Component({
  selector: 'app-property-configuration',
  templateUrl: './property-configuration.component.html',
  styleUrls: ['./property-configuration.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyConfigurationComponent implements OnInit {

  readonly properties$ = this.store.select(selectAllPropertiesSorted);
  readonly selectedProperty$ = this.store.select(selectActiveProperty);

  onPropertySelected(id: string) {
    this.store.dispatch(suitConfigActions.UserActions.selectProperty({ propertyId: id }));
  }

  onSaveRequested(properties: StatConfiguration[]) {
    this.store.dispatch(suitConfigActions.UserActions.saveSettings({ properties }));
  }

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(suitConfigActions.Actions.initialize());
  }

}

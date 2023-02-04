import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { map, take, tap } from 'rxjs';
import { StatConfiguration } from 'src/app/state/models/suit-config.models';
import { selectAllProperties } from 'src/app/state/selectors/suit-config.selectors';
import * as suitConfigActions from '../../state/actions/suit-config.actions'


interface PageState {
  properties: StatConfiguration[];
  data: Record<string, string>;
}

@Component({
  selector: 'app-build-request-summary-dialog',
  templateUrl: './build-request-summary-dialog.component.html',
  styleUrls: ['./build-request-summary-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildRequestSummaryDialogComponent {

  readonly pageState$ = this.store.select(selectAllProperties).pipe(
    map(properties => properties.reduce((acc, property) => {
      if (property.minimum && property.target) {
        acc.properties.push(property);

        if (property.minimum !== property.target) {
          acc.data[property.id] = `${property.minimum} to ${property.target}`;
        } else {
          acc.data[property.id] = `${property.minimum || property.target}`;
        }
      }

      return acc;
    }, {
      properties: [],
      data: {}
    } as PageState))
  );

  onChangeSettings() {
    this.dialogRef.afterClosed().pipe(
      take(1),
      tap(() => this.store.dispatch(suitConfigActions.Actions.navigateToSettings()))
    ).subscribe();

    this.dialogRef.close();
  }

  constructor(
    private store: Store,
    private dialogRef: MatDialogRef<BuildRequestSummaryDialogComponent>
  ) { }

}

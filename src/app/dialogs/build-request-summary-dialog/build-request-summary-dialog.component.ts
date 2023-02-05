import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StatConfiguration } from 'src/app/state/models/suit-config.models';


export interface BuildRequestSummaryDialogData {
  properties: StatConfiguration[];
}

@Component({
  selector: 'app-build-request-summary-dialog',
  templateUrl: './build-request-summary-dialog.component.html',
  styleUrls: ['./build-request-summary-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildRequestSummaryDialogComponent implements OnInit {

  readonly form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: BuildRequestSummaryDialogData,
    private formBuilder: FormBuilder,
    ) {
    this.form = formBuilder.group({});
  }

  ngOnInit(): void {
    this.data.properties.forEach(property =>
      this.form.addControl(property.id, this.formBuilder.control({
        maximum: property.maximum,
        minimum: property.minimum,
        scalingFactor: property.scalingFactor,
        target: property.target
      })));
  }
}

import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectionListChange } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { StatConfiguration } from 'src/app/state/models/suit-config.models';
import * as suitConfigActions from '../../../state/actions/suit-config.actions';


@Component({
  selector: 'app-property-configuration-form',
  templateUrl: './property-configuration-form.component.html',
  styleUrls: ['./property-configuration-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyConfigurationFormComponent implements OnInit, OnChanges {
  @ViewChild('fileInput', { static: true }) fileInput!: ElementRef<HTMLInputElement>;

  @Input() properties: StatConfiguration[];
  @Input() selectedProperty: StatConfiguration;

  @Output() propertySelected = new EventEmitter<string>();
  @Output() saveRequested = new EventEmitter<StatConfiguration[]>();

  readonly form: FormGroup;

  private resetForm() {
    this.form.reset(this.properties.reduce((acc, property) => {
      (acc as any)[property.id] = property;
      return acc;
    }, {} as Record<string, StatConfiguration>));
    this.form.markAsPristine();
  }

  onExportClicked() {
    this.store.dispatch(suitConfigActions.UserActions.exportSettings());
  }

  onFileSelected(event: any) {
    const files: FileList = event?.target?.files;
    if (!files?.length) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const text: string = e.target.result;
        if (!text) { return; }

        const splitFilename = file.name?.split('.');
        if (!splitFilename) { return; }

        const extension = splitFilename[splitFilename.length - 1];
        switch (extension) {
          case 'json':
            this.store.dispatch(suitConfigActions.UserActions.importProperties({ properties: JSON.parse(text) }))
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

  onPropertySelected(event: MatSelectionListChange) {
    this.propertySelected.emit((event.options[0].value as StatConfiguration).id);
  }

  save() {
    const updatedValues = Object.entries(this.form.controls).reduce((acc, [id, control]) => {
      if (control.dirty) {
        acc.push({
          ...control.value as StatConfiguration,
          id
        });
      }

      return acc;
    }, []);
    this.saveRequested.emit(updatedValues);
  }

  reset() {
    this.resetForm();
  }

  constructor(
    private formBuilder: FormBuilder,
    private store: Store
  ) {
    this.form = formBuilder.group({});
  }

  ngOnInit(): void {
    this.properties.forEach(property => this.form.addControl(property.id, this.formBuilder.control(property)));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['properties']) {
      this.resetForm();
    }
  }
}
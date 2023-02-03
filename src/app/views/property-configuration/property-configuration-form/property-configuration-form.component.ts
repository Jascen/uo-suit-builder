import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectionListChange } from '@angular/material/list';
import { StatConfiguration } from 'src/app/state/models/suit-config.models';


@Component({
  selector: 'app-property-configuration-form',
  templateUrl: './property-configuration-form.component.html',
  styleUrls: ['./property-configuration-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyConfigurationFormComponent implements OnInit, OnChanges {

  @Input() properties: StatConfiguration[];
  @Input() selectedProperty: StatConfiguration;

  @Output() propertySelected = new EventEmitter<string>();
  @Output() saveRequested = new EventEmitter<StatConfiguration[]>();

  readonly form: FormGroup;

  onPropertySelected(event: MatSelectionListChange) {
    this.propertySelected.emit((event.options[0].value as StatConfiguration).id);
  }

  private resetForm() {
    this.form.reset(this.properties.reduce((acc, property) => {
      (acc as any)[property.id] = property;
      return acc;
    }, {} as Record<string, StatConfiguration>));
    this.form.markAsPristine();
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

  constructor(private formBuilder: FormBuilder) {
    this.form = formBuilder.group({});
  }

  ngOnInit(): void {
    this.properties.forEach(property => this.form.addControl(property.id, this.formBuilder.control(property)));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedProperty'] && this.selectedProperty) {
      this.form.get(this.selectedProperty.id).setValue(this.selectedProperty);
    }

    if (changes['properties']) {
      this.resetForm();
    }
  }
}
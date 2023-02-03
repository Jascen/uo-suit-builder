import { ChangeDetectionStrategy, Component, forwardRef, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { Subject, takeUntil, tap } from 'rxjs';
import { StatConfiguration } from 'src/app/state/models/suit-config.models';


interface PropertyForm {
  name: FormControl<string>;
  scalingFactor: FormControl<number>;
  minimum: FormControl<number>;
  target: FormControl<number>;
  maximum: FormControl<number>;
}

@Component({
  selector: 'app-property-configuration-control',
  templateUrl: './property-configuration-control.component.html',
  styleUrls: ['./property-configuration-control.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => PropertyConfigurationControlComponent)
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PropertyConfigurationControlComponent),
      multi: true,
    },
  ]
})
export class PropertyConfigurationControlComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {

  private readonly _destroyed$ = new Subject();

  readonly form: FormGroup<PropertyForm>;

  private onChange = (property: StatConfiguration) => { };
  private onTouched = () => { };
  private onValidate = () => { };

  valueChanged(property: StatConfiguration) {
    this.onTouched();
    this.writeValue(property);
    this.onChange(property);
  }

  writeValue(property: StatConfiguration): void {
    this.form.setValue({
      name: property.name,
      maximum: property.maximum,
      minimum: property.minimum,
      scalingFactor: property.scalingFactor,
      target: property.target
    });
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      name: ['', Validators.required],
      scalingFactor: [null],
      minimum: [null],
      target: [null],
      maximum: [null],
    });
  }

  validate(control: AbstractControl<any, any>): ValidationErrors {
    return Object.entries(this.form.controls).reduce((acc, [name, control]) => {
      if (control.hasError) {
        acc[name] = control;
      }

      return acc;
    }, {} as ValidationErrors);
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.onValidate = fn;
  }

  ngOnInit(): void {
    this.form.valueChanges.pipe(
      tap(change => this.onChange(change as any)),
      takeUntil(this._destroyed$)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }
}

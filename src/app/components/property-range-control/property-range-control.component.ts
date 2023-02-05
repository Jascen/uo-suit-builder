import { ChangeDetectionStrategy, Component, forwardRef, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { Subject, takeUntil, tap } from 'rxjs';


interface PropertyForm {
  scalingFactor: FormControl<number>;
  minimum: FormControl<number>;
  target: FormControl<number>;
  maximum: FormControl<number>;
}

export interface PropertyRangeControlValue {
  scalingFactor: number;
  minimum: number;
  target: number;
  maximum: number;
}

@Component({
  selector: 'app-property-range-control',
  templateUrl: './property-range-control.component.html',
  styleUrls: ['./property-range-control.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => PropertyRangeControlComponent)
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PropertyRangeControlComponent),
      multi: true,
    },
  ]
})
export class PropertyRangeControlComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {

  private readonly _destroyed$ = new Subject();

  readonly form: FormGroup<PropertyForm>;

  private onChange = (property: PropertyRangeControlValue) => { };
  private onTouched = () => { };
  private onValidate = () => { };

  valueChanged(property: PropertyRangeControlValue) {
    this.onTouched();
    this.writeValue(property);
    this.onChange(property);
  }

  writeValue(property: PropertyRangeControlValue): void {
    this.form.setValue({
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
      scalingFactor: [null],
      minimum: [null],
      target: [null],
      maximum: [null],
    });
  }

  validate(control: AbstractControl<any, any>): ValidationErrors {
    return Object.entries(this.form.controls).reduce((acc, [name, control]) => {
      if ((control as AbstractControl).errors) {
        acc[name] = control.errors;
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

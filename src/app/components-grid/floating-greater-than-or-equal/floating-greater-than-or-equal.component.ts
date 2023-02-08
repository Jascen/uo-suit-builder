import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { IFloatingFilterAngularComp } from 'ag-grid-angular';
import { IFloatingFilterParams, ISimpleFilter } from 'ag-grid-community';
import { ISimpleFilterModelType } from 'ag-grid-community/dist/lib/filter/provided/simpleFilter';


@Component({
  selector: 'app-floating-greater-than-or-equal',
  templateUrl: './floating-greater-than-or-equal.component.html',
  styleUrls: ['./floating-greater-than-or-equal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloatingGreaterThanOrEqualComponent implements IFloatingFilterAngularComp {
  params!: IFloatingFilterParams<ISimpleFilter>;
  currentValue: number = null;

  agInit(params: IFloatingFilterParams<ISimpleFilter>): void {
    this.params = params;
  }

  onParentModelChanged(parentModel: any) {
    // When the filter is empty we will receive a null value here
    if (!parentModel) {
      this.currentValue = null;
    } else {
      this.currentValue = parentModel.filter;
    }
  }

  onInputBoxChanged() {
    if (!this.currentValue) {
      // Remove the filter
      this.params.parentFilterInstance(instance => instance.onFloatingFilterChanged(null, null));
      return;
    }

    this.currentValue = Number(this.currentValue);
    this.params.parentFilterInstance(instance => instance.onFloatingFilterChanged('greaterThanOrEqual' as ISimpleFilterModelType, this.currentValue));
  }
}
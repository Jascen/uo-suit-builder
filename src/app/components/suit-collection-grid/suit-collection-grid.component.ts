import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ColDef, FilterChangedEvent, GridApi, GridReadyEvent, RowSelectedEvent } from 'ag-grid-community';
import { Subject, BehaviorSubject, filter, startWith, switchMap, takeUntil, tap } from 'rxjs';
import { FloatingGreaterThanOrEqualComponent } from 'src/app/components-grid/floating-greater-than-or-equal/floating-greater-than-or-equal.component';
import { Suit } from 'src/app/state/models/suit-collection.models';


export interface ItemProperty {
  id: string;
  shortName: string;
  name: string;
}

interface PageColDef extends ColDef<Suit> {
}

export enum GridFilterModule {
  Number = "agNumberColumnFilter",
  Text = "agTextColumnFilter",
  Date = "agDateColumnFilter",
}

@Component({
  selector: 'app-suit-collection-grid',
  templateUrl: './suit-collection-grid.component.html',
  styleUrls: ['./suit-collection-grid.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuitCollectionGridComponent implements OnInit, OnChanges, OnDestroy {

  @Input() properties!: ItemProperty[];
  @Input() rowData!: Suit[];
  @Input() loading: boolean = true;
  @Input() gridFilter: {};

  @Output() suitSelected = new EventEmitter<string>();
  @Output() filterChanged = new EventEmitter<{}>();

  private _gridApi!: GridApi;
  private readonly _destroyed$ = new Subject();
  private readonly _gridLoaded$ = new BehaviorSubject<boolean>(false);
  private readonly _reloadData$ = new BehaviorSubject<any>(null);

  private createColumns(itemProperties: ItemProperty[]) {
    const defaultColDef = {
      sortable: true,
      resizable: true,
      width: 130,

      suppressMenu: true,
      floatingFilter: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      filter: GridFilterModule.Number,
      floatingFilterComponent: FloatingGreaterThanOrEqualComponent,
    } as PageColDef;

    const columnDefinitions = [] as PageColDef[];

    itemProperties.forEach(property => {
      columnDefinitions.push({
        field: property.id,
        headerName: property.shortName ?? property.name,
        valueGetter: params => params.data?.summary ? params.data.summary[property.id] : null
      } as PageColDef);
    });

    return {
      columnDefinitions,
      defaultColDef
    };
  }

  getRowId = (params: { data: Suit }) => params.data.id;

  getSelected(): number[] {
    const selectedNodes = this._gridApi?.getSelectedNodes();
    if (!selectedNodes?.length) { return []; }

    return selectedNodes.map(node => Number(node.id));
  }

  onFilterChanged(event: FilterChangedEvent) {
    this.filterChanged.emit(event.api.getFilterModel());
  }

  onGridReady(params: GridReadyEvent) {
    this._gridApi = params.api;
    this._gridLoaded$.next(true);
  }

  onRowSelected(event: RowSelectedEvent<Suit>) {
    if (event.node.isSelected()) {
      this.suitSelected.emit(event.data.id);
    }
  }

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['loading'] || changes['rowData']) {
      this._reloadData$.next(null);
    }
  }

  ngOnDestroy(): void {
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }

  ngOnInit(): void {
    this._gridLoaded$.pipe(
      filter(loaded => loaded),

      switchMap(() => this._reloadData$.pipe(startWith({}))),
      tap(() => {
        this._gridApi.showLoadingOverlay();
        if (this.loading) { return; }

        // Set columns
        const { defaultColDef, columnDefinitions } = this.createColumns(this.properties ?? []);
        this._gridApi.setDefaultColDef(defaultColDef);
        this._gridApi.setColumnDefs(columnDefinitions);

        // Set data
        const rowData = this.rowData || [];
        this._gridApi.setRowData(rowData);

        // Set filter
        this._gridApi.setFilterModel(this.gridFilter ?? {});
      }),
      takeUntil(this._destroyed$)
    ).subscribe();
  }
}

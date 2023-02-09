import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent, IRowNode, RowDropZoneParams, SelectionChangedEvent } from 'ag-grid-community';
import { Subject, BehaviorSubject, filter, startWith, switchMap, takeUntil, tap } from 'rxjs';
import { FloatingGreaterThanOrEqualComponent } from 'src/app/components-grid/floating-greater-than-or-equal/floating-greater-than-or-equal.component';
import { Item } from 'src/app/state/models/item-collection.models';


export interface ItemProperty {
  id: string;
  shortName: string;
  name: string;
}

interface PageColDef extends ColDef<Item> {
}

export enum GridFilterModule {
  Number = "agNumberColumnFilter",
  Text = "agTextColumnFilter",
  Date = "agDateColumnFilter",
}

@Component({
  selector: 'app-item-collection-grid',
  templateUrl: './item-collection-grid.component.html',
  styleUrls: ['./item-collection-grid.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemCollectionGridComponent implements OnInit, OnChanges, OnDestroy {

  @Input() properties: ItemProperty[];
  @Input() rowData: Item[];
  @Input() loading: boolean = true;
  @Input() selectedIds: number[];

  @Output() selectedRowsChanged = new EventEmitter<number[]>();
  @Output() gridInitialized = new EventEmitter<GridApi>();

  private _gridApi!: GridApi;
  private readonly _destroyed$ = new Subject();
  private readonly _gridLoaded$ = new BehaviorSubject<boolean>(false);
  private readonly _reloadData$ = new BehaviorSubject<any>(null);

  private addTypedColumns<T>(columns: ColDef<T>[], ...cols: (ColDef<T> & { field: keyof T })[]) {
    for (let i = 0; i < cols.length; i++) {
      columns.push(cols[i]);
    }
  }

  private createColumns(itemProperties: ItemProperty[]) {
    const defaultColDef = {
      sortable: true,
      resizable: true,
      width: 130,

      suppressMenu: true,
      floatingFilter: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
    } as PageColDef;

    const columnDefinitions = [] as PageColDef[];
    this.addTypedColumns(columnDefinitions,
      {
        rowDrag: true,
        rowDragText: (params: { rowNode?: { data: Item } }, dragItemCount) => params.rowNode!.data.slot as string,
        field: 'name',
        headerName: 'Name',
        width: 200,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        lockPosition: true,
        filter: GridFilterModule.Text,
        pinned: 'left',
      },
      {
        field: 'slot',
        pinned: 'left',
        lockPosition: true,
        filter: GridFilterModule.Text,
      },
    );

    itemProperties.forEach(property => {
      columnDefinitions.push({
        field: property.id,
        headerName: property.shortName || property.name,
        filter: GridFilterModule.Number,
        floatingFilterComponent: FloatingGreaterThanOrEqualComponent,
        floatingFilterComponentParams: { suppressFilterButton: true },
        valueGetter: params => params.data?.properties[property.id]
      } as PageColDef);
    });

    return {
      columnDefinitions,
      defaultColDef
    };
  }

  private setSelectedState(selectedRowIds: number[], gridApi?: GridApi) {
    if (!gridApi) { return; }

    gridApi.deselectAll();
    if (!selectedRowIds?.length) { return; }

    let selectedNode: IRowNode<Item>;
    selectedRowIds.forEach(id => {
      const rowNode = gridApi.getRowNode(id.toString());
      if (!rowNode) { return; }

      // Set the previous one if we set it.
      if (selectedNode) {
        selectedNode.setSelected(true, false, true);
      }

      // Store it so we can execute a refresh on the final one
      selectedNode = rowNode;
    });

    if (selectedNode) {
      selectedNode.setSelected(true, false, false);
    }
  }

  getRowId = ({ data }: { data: Item }) => data.id.toString();

  onGridReady(params: GridReadyEvent) {
    this._gridApi = params.api;
    this._gridLoaded$.next(true);
  }

  onSelectionChanged(event: SelectionChangedEvent) {
    const selectedRows = event.api.getSelectedRows() as Item[];
    this.selectedRowsChanged.emit(selectedRows.map(item => item.id));
  }

  setDropzone(params: RowDropZoneParams) {
    this._gridApi.addRowDropZone(params);
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
      tap(() => this.gridInitialized.emit(this._gridApi)),

      switchMap(() => this._reloadData$.pipe(startWith({}))),
      tap(() => {
        this._gridApi.showLoadingOverlay();
        if (this.loading) { return; }

        const { defaultColDef, columnDefinitions } = this.createColumns(this.properties ?? []);
        this._gridApi.setDefaultColDef(defaultColDef);
        this._gridApi.setColumnDefs(columnDefinitions);

        // Set Data
        const rowData = this.rowData || [];
        this._gridApi.setRowData(rowData);

        // Select rows
        this.setSelectedState(this.selectedIds, this._gridApi);
      }),
      takeUntil(this._destroyed$)
    ).subscribe();
  }
}

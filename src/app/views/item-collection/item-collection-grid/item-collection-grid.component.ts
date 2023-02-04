import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject, BehaviorSubject, combineLatest, filter, startWith, switchMap, takeUntil, tap, delay } from 'rxjs';
import { Item } from 'src/app/state/models/item-collection.models';


export interface ItemProperty {
  id: string;
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

  @Input() properties!: ItemProperty[] | null;
  @Input() rowData!: Item[] | null;
  @Input() loading: boolean = true;

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
      suppressMovable: true,
      sortable: true,
      resizable: true,

      floatingFilter: true,
      filter: GridFilterModule.Text,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
      }
    } as PageColDef;

    const columnDefinitions = [] as PageColDef[];
    this.addTypedColumns(columnDefinitions,
      {
        field: 'name',
        headerName: 'Name',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        lockPosition: true,
        pinned: 'left',
      },
      {
        field: 'slot',
        pinned: 'left',
      },
    );

    itemProperties.forEach(property => {
      columnDefinitions.push({
        field: property.id,
        headerName: property.name,
        filter: GridFilterModule.Number,
        valueGetter: params => params.data?.properties[property.id]
      } as PageColDef);
    });

    return {
      columnDefinitions,
      defaultColDef
    };
  }

  getRowId = ({ data }: { data: Item }) => data.id.toString();

  getSelected(): number[] {
    const selectedNodes = this._gridApi?.getSelectedNodes();
    if (!selectedNodes?.length) { return []; }

    return selectedNodes.map(node => Number(node.id));
  }

  onGridReady(params: GridReadyEvent) {
    this._gridApi = params.api;
    this._gridLoaded$.next(true);
  }

  constructor() { }

  ngOnChanges(): void {
    this._reloadData$.next(null);
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

        const { defaultColDef, columnDefinitions } = this.createColumns(this.properties ?? []);
        this._gridApi.setDefaultColDef(defaultColDef);
        this._gridApi.setColumnDefs(columnDefinitions);

        const rowData = this.rowData || [];
        this._gridApi.setRowData(rowData);
      }),
      takeUntil(this._destroyed$)
    ).subscribe();
  }
}

import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject, BehaviorSubject, filter, startWith, switchMap, takeUntil, tap } from 'rxjs';
import { Item } from 'src/app/state/models/item-collection.models';
import { Suit } from 'src/app/state/models/suit-builder.models';


export interface ItemProperty {
  id: string;
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

  private _gridApi!: GridApi;
  private readonly _destroyed$ = new Subject();
  private readonly _gridLoaded$ = new BehaviorSubject<boolean>(false);
  private readonly _reloadData$ = new BehaviorSubject<any>(null);

  private createColumns(itemProperties: ItemProperty[]) {
    const defaultColDef = {
      suppressMovable: true,
      sortable: true,
      resizable: true,

      floatingFilter: true,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
      }
    } as PageColDef;

    const columnDefinitions = [] as PageColDef[];

    itemProperties.forEach(property => {
      columnDefinitions.push({
        field: property.id,
        headerName: property.name,
        filter: GridFilterModule.Number,
        valueGetter: params => params.data?.summary ? params.data.summary[property.id] : null
      } as PageColDef);
    });

    return {
      columnDefinitions,
      defaultColDef
    };
  }

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

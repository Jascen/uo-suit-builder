import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { filter, map, switchMap } from "rxjs";
import { Item, ItemSlot } from "../models/item-collection.models";
import { SuitBuilderService } from "src/app/services/suit-builder.service";
import { MatDialog } from "@angular/material/dialog";
import { BuildRequestSummaryDialogComponent } from "src/app/dialogs/build-request-summary-dialog/build-request-summary-dialog.component";
import * as fromItemCollection from '../selectors/item-collection.selectors';
import * as fromSuitConfig from '../selectors/suit-config.selectors';
import * as suitBuilderActions from '../actions/suit-builder.actions';
import * as itemCollectionActions from '../actions/item-collection.actions';


@Injectable()
export class ItemCollectionEffects {

    importData$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(itemCollectionActions.UserActions.import),
            map(action => {
                return itemCollectionActions.UserActions.importSuccess({
                    items: action.items.map((item, index) => {
                        const result = {
                            id: index,
                            name: item.name,
                            slot: item.slot,
                            properties: {}
                        } as Item;

                        let hasProperties = false;
                        Object.keys(item).forEach(key => {
                            if (item[key] === null || (item[key] as any) === '') { return; }
                            if (key === 'name' || key === 'slot') { return; }

                            result.properties[key] = item[key];
                            hasProperties = true;
                        });

                        return hasProperties ? result : null;
                    }).filter(item => item)
                });
            })
        );
    });

    promptToBuild$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(itemCollectionActions.UserActions.build),
            filter(action => !!action.itemIds?.length),

            switchMap(action => {
                const dialogRef = this.dialog.open(BuildRequestSummaryDialogComponent, {
                    width: '500px'
                });
                return dialogRef.afterClosed().pipe(
                    map((result: boolean) => result
                        ? itemCollectionActions.UserActions.buildApproved({ itemIds: action.itemIds })
                        : null),
                    filter(result => !!result)
                )
            })
        )
    });

    buildSuit$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(itemCollectionActions.UserActions.buildApproved),

            concatLatestFrom(() => [this.store.select(fromSuitConfig.selectAllProperties), this.store.select(fromItemCollection.selectItemCollectionEntities)]),

            map(([action, suitConfigOptions, itemEntities]) => {
                const itemsByType = action.itemIds.reduce((acc, itemId) => {
                    const item = itemEntities[itemId];
                    if (item) {
                        acc[item.slot] ??= [];
                        acc[item.slot].push(item);
                    }

                    return acc;
                }, {} as Record<ItemSlot, Item[]>);

                const suit = this.suitBuilderService.createSuitIncrementally(itemsByType, suitConfigOptions);
                const suitVariations = this.suitBuilderService.createSuitVariations(suit, itemsByType, suitConfigOptions);
                suitVariations.forEach((suit, index) => (suit.id = index.toString()));

                return suitBuilderActions.UserActions.buildSuccess({ suits: suitVariations });
            })
        )
    });

    constructor(
        private actions$: Actions,
        private store: Store,
        private suitBuilderService: SuitBuilderService,
        private dialog: MatDialog
    ) {
    }
}
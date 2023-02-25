import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { EMPTY, filter, map, switchMap } from "rxjs";
import { Item, ItemSlot } from "../models/item-collection.models";
import { BuilderAlgorithmType, SuitBuilderService } from "src/app/services/suit-builder.service";
import { MatDialog } from "@angular/material/dialog";
import { BuildRequestSummaryDialogComponent, BuildRequestSummaryDialogData } from "src/app/dialogs/build-request-summary-dialog/build-request-summary-dialog.component";
import { Suit } from "../models/suit-collection.models";
import { PropertyRangeControlValue } from "src/app/components/property-range-control/property-range-control.component";
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

            concatLatestFrom(() => [
                this.store.select(fromSuitConfig.selectAllFilterableProperties),
                this.store.select(fromItemCollection.selectAllItems)
            ]),
            switchMap(([action, properties, items]) => {
                if (!items.length) { return EMPTY; }

                const dialogRef = this.dialog.open(BuildRequestSummaryDialogComponent, {
                    width: '500px',
                    data: {
                        properties: properties
                    } as BuildRequestSummaryDialogData
                });
                return dialogRef.afterClosed().pipe(
                    map((result: false | Record<string, PropertyRangeControlValue>) =>
                        result
                            ? itemCollectionActions.UserActions.buildApproved({
                                properties: properties.map(property => {
                                    const update = result[property.id];

                                    return {
                                        id: property.id,
                                        minimum: update.minimum,
                                        maximum: update.maximum,
                                        scalingFactor: update.scalingFactor,
                                        target: update.target
                                    };
                                })
                            })
                            : null
                    ),
                    filter(result => !!result)
                )
            })
        )
    });

    buildSuit$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(itemCollectionActions.UserActions.buildApproved),

            concatLatestFrom(() => [
                this.store.select(fromSuitConfig.selectAllProperties),
                this.store.select(fromItemCollection.selectAllItemsIgnoreBaseline),
                this.store.select(fromItemCollection.selectActiveItemIds),
                this.store.select(fromItemCollection.selectBaselineSuit),
            ]),

            map(([action, suitConfigOptions, items, selectedItemIds, baselineSuit]) => {
                const itemIds = new Set<number>();
                selectedItemIds.forEach(id => itemIds.add(id));

                const startingSuit = {} as Record<ItemSlot, Item>;
                const itemsByType = items.reduce((acc, item) => {

                    if (itemIds.has(item.id)) {
                        if (!acc[item.slot]) {
                            acc[item.slot] = [];
                            // Seed baseline suit with Keys
                            startingSuit[item.slot] = null;
                        }

                        acc[item.slot].push(item);
                    }

                    return acc;
                }, {} as Record<ItemSlot, Item[]>);

                // Set baseline suit Values if we have any
                baselineSuit.items.forEach(item => startingSuit[item.slot] = item);

                const totalSuitPermutations = Object.values(itemsByType).reduce((acc, items) => acc * items.length, 1);
                const algorithm = totalSuitPermutations < 500_000 ? BuilderAlgorithmType.BruteForce : BuilderAlgorithmType.UncommonProperties;

                const suits = this.suitBuilderService.createSuits(algorithm, startingSuit, itemsByType, suitConfigOptions);

                // De-dupe the suits
                const filteredSuits = suits.reduce((acc, suit) => {
                    suit.items.sort((a, b) => a.slot.localeCompare(b.slot));
                    suit.id = suit.items.map(item => `${item.slot}_${item.id}`).join('__');

                    // Configurable - Filter out suits that do not meet minimum requirements
                    const ignoreMinimumRequirements = true;
                    if (ignoreMinimumRequirements || suitConfigOptions.every(property => (property.minimum ?? 0) <= suit.summary[property.id])) {
                        acc[suit.id] = suit;
                    }

                    return acc;
                }, {} as Record<string, Suit>);

                return suitBuilderActions.UserActions.buildSuccess({ suits: Object.values(filteredSuits).sort((a, b) => b.score - a.score) });
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
import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { filter, map, switchMap } from "rxjs";
import { Item, ItemSlot } from "../models/item-collection.models";
import { SuitBuilderService } from "src/app/services/suit-builder.service";
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

            concatLatestFrom(() => this.store.select(fromSuitConfig.selectAllFilterableProperties)),
            switchMap(([action, properties]) => {
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
                this.store.select(fromSuitConfig.selectAllFilterableProperties),
                this.store.select(fromItemCollection.selectItemCollectionEntities),
                this.store.select(fromItemCollection.selectActiveItemIdss),
            ]),

            map(([action, suitConfigOptions, itemEntities, itemIds]) => {
                const itemsByType = itemIds.reduce((acc, itemId) => {
                    const item = itemEntities[itemId];
                    if (item) {
                        acc[item.slot] ??= [];
                        acc[item.slot].push(item);
                    }

                    return acc;
                }, {} as Record<ItemSlot, Item[]>);

                const suits = [] as Suit[];

                const iterations = 10;
                for (let index = 0; index < iterations; index++) {
                    const sourceSuit = this.suitBuilderService.createSuitIncrementally(itemsByType, suitConfigOptions);
                    const suitVariations = this.suitBuilderService.createSuitVariations(sourceSuit, itemsByType, suitConfigOptions);
                    const filteredSuits = suitVariations.reduce((acc, suit) => {
                        suit.items.sort((a, b) => a.slot.localeCompare(b.slot));
                        suit.id = suit.items.map(item => `${item.slot}_${item.id}`).join('__');

                        const ignoreMinimumRequirements = true;
                        if (ignoreMinimumRequirements || suitConfigOptions.every(property => (property.minimum ?? 0) <= suit.summary[property.id])) {
                            acc[suit.id] = suit;
                        }

                        return acc;
                    }, {} as Record<string, Suit>);

                    // Add suits
                    Object.values(filteredSuits).forEach(suit => suits.push(suit));

                    // Remove all pieces for the suit that was used to seed everything
                    Object.keys(itemsByType).forEach(key => {
                        const itemSlot = key as ItemSlot;
                        const targetItem = sourceSuit.items.find(item => item.slot === itemSlot);
                        itemsByType[itemSlot] = itemsByType[itemSlot].filter(item => item !== targetItem);
                    });
                }

                return suitBuilderActions.UserActions.buildSuccess({ suits: suits.sort((a, b) => b.score - a.score) });
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
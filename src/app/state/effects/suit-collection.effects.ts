import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map } from "rxjs";
import { SuitBuilderService } from "src/app/services/suit-builder.service";
import { ItemSlot, Item } from "../models/item-collection.models";
import { Suit } from "../models/suit-collection.models";
import * as suitCollectionActions from '../actions/suit-collection.actions';
import * as suitBuilderActions from '../actions/suit-builder.actions';
import * as fromItemCollection from '../selectors/item-collection.selectors';
import * as fromSuitConfig from '../selectors/suit-config.selectors';


@Injectable()
export class SuitCollectionEffects {

    buildSuit$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(suitCollectionActions.UserActions.createSuitVariations),

            concatLatestFrom(() => [
                this.store.select(fromSuitConfig.selectAllFilterableProperties),
                this.store.select(fromItemCollection.selectAllActiveItems),
                this.store.select(fromItemCollection.selectItemCollectionEntities),
            ]),

            map(([action, suitConfigOptions, items, itemEntities]) => {
                const itemIds = new Set<number>();
                action.items.forEach(itemId => itemIds.add(itemId));

                const startingSuit = {} as Record<ItemSlot, Item>;
                action.items.forEach(itemId => {
                    const item = itemEntities[itemId];
                    startingSuit[item.slot] = item;
                });

                const itemsByType = items.reduce((acc, item) => {

                    if (!itemIds.has(item.id)) {
                        acc[item.slot] ??= [];
                        acc[item.slot].push(item);
                    }

                    return acc;
                }, {} as Record<ItemSlot, Item[]>);

                const suits = this.suitBuilderService.createSuitVariationsByAllPermutations(startingSuit, itemsByType, suitConfigOptions);

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
    ) {
    }
}
import { Injectable } from "@angular/core";
import { createEffect, ofType, concatLatestFrom, Actions } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map } from "rxjs";
import { Item, ItemSlot } from "../models/item-collection.models";
import { StatConfiguration } from "../models/suit-config.models";
import * as fromItemCollection from '../selectors/item-collection.selectors';
import * as fromSuitConfig from '../selectors/suit-config.selectors';
import * as suitBuilderActions from '../actions/suit-builder.actions';
import * as suitConfigActions from '../actions/suit-config.actions';
import * as itemCollectionActions from '../actions/item-collection.actions';


export interface Suit {
    score: number;
    items: string[];
}

@Injectable()
export class SuitBuilderEffects {

    private createSuit(suitItems: Item[], currentItem: Item, suitConfigOptions: StatConfiguration[]) {
        let score = 0;
        const summary = {} as Record<string, number>;

        suitConfigOptions.every(option => {
            let value = currentItem.properties[option.id] ?? 0;
            suitItems.forEach(item => value += item.properties[option.id] ?? 0);

            if (value < option.minimum) { return false; }
            if (value === 0 && 0 < option.minimum) { return false; } // If there's no value and a min is set, scrap the suit

            summary[option.id] = value;

            // Within target range
            if (option.target <= value && value < option.maximum) {
                score += option.scalingFactor * value;
            } else {
                score += (option.scalingFactor / 2) * value;
            }

            return true;
        });

        if (score === 0) { return null; }

        return {
            score,
            //items: [...suitItems.map(suitItem => suitItem.id), currentItem.id]
            items: [...suitItems, currentItem] as any,
            summary
        } as Suit;
    }

    private recurse(slotPosition: number, itemSlots: ItemSlot[], itemsBySlot: Record<string, Item[]>, suitConfigOptions: StatConfiguration[], currentSuitItems: Item[], suits: Suit[]): any {
        const currentSlot = itemSlots[slotPosition];
        const items = itemsBySlot[currentSlot];
        if (!items?.length) { return suits; }

        const isLeaf = itemSlots.length - 1 < slotPosition + 1;
        if (isLeaf) {
            items.forEach(item => {
                const suit = this.createSuit(currentSuitItems, item, suitConfigOptions);
                if (!suit) { return; }

                // Confirm the score is high enough
                if (suits.length && suit.score <= suits[suits.length - 1].score) { return; }

                const maxSuitCount = 10;
                if (maxSuitCount <= suits.length) {
                    suits.pop(); // Remove
                }

                suits.push(suit); // Add
                suits.sort((a, b) => b.score - a.score);
            });
        } else {
            items.forEach(item => this.recurse(slotPosition + 1, itemSlots, itemsBySlot, suitConfigOptions, [...currentSuitItems, item], suits));
        }

        return suits;
    }

    buildSuit$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(
                suitBuilderActions.UserActions.build,
                suitConfigActions.Actions.initializeSuccess,
                //itemCollectionActions.UserActions.importSuccess
            ),
            concatLatestFrom(() => [this.store.select(fromSuitConfig.selectAllPropertyEntities), this.store.select(fromItemCollection.selectAllItemsByType)]),

            map(([action, suitConfigOptions, itemsByType]) => {
                const slots = Object.keys(itemsByType) as ItemSlot[];
                const suits = this.recurse(0, slots, itemsByType, suitConfigOptions, [], []);
                console.log(suits);

                // TODO: Cherry-pick data

                return suitBuilderActions.UserActions.buildSuccess({ data: suits });
            })
        )
    });

    buildSuitWithItems$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(
                itemCollectionActions.UserActions.build
            ),
            concatLatestFrom(() => [this.store.select(fromSuitConfig.selectAllPropertyEntities), this.store.select(fromItemCollection.selectItemCollectionEntities)]),

            map(([action, suitConfigOptions, itemEntities]) => {
                const start = new Date();
                const o = action.itemIds.reduce((acc, itemId) => {
                    const item = itemEntities[itemId];
                    if (item) {
                        acc.itemsByType[item.slot] ??= [];
                        acc.itemsByType[item.slot].push(item);
                    }

                    return acc;
                }, {
                    itemsByType: {} as Record<ItemSlot, Item[]>
                });

                const slots = Object.keys(o.itemsByType) as ItemSlot[];

                const suits = this.recurse(0, slots, o.itemsByType, suitConfigOptions, [], []);
                console.log(suits);

                // TODO: Cherry-pick data

                return suitBuilderActions.UserActions.buildSuccess({ data: suits });
            })
        )
    });

    constructor(
        private actions$: Actions,
        private store: Store
    ) { }
}
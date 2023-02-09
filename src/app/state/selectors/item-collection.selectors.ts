import { createSelector } from "@ngrx/store";
import { ItemSlot } from "../models/item-collection.models";
import { selectAll, selectEntities } from "../reducers/item-collection.reducers";
import * as fromFeature from "../reducers";
import { Suit } from "../models/suit-collection.models";


export const selectItemCollectionEntities = createSelector(
    fromFeature.selectItemCollectionState,
    state => selectEntities(state.items)
);

export const selectAllItems = createSelector(
    fromFeature.selectItemCollectionState,
    state => selectAll(state.items)
);

export const selectActiveItemIds = createSelector(
    fromFeature.selectItemCollectionState,
    state => state.activeIds
);

export const selectAllActiveItems = createSelector(
    selectItemCollectionEntities,
    selectActiveItemIds,
    (itemEntities, activeIds) => activeIds.map(id => itemEntities[id])
);

export const selectBaselineSuit = createSelector(
    fromFeature.selectItemCollectionState,
    selectItemCollectionEntities,
    (state, entities) => state.baselineItems.reduce((acc, id) => {
        const item = entities[id];
        Object.entries(item.properties).forEach(([id, value]) => {
            acc.summary[id] ??= 0;
            acc.summary[id] += value;
        });

        acc.items.push(item);
        return acc;
    }, {
        summary: {},
        items: []
    } as Suit)
);

export const selectAllItemsIgnoreBaseline = createSelector(
    selectBaselineSuit,
    selectAllItems,
    (baselineSuit, items) => {
        const slotsToFilter = new Set<ItemSlot>();
        baselineSuit.items.forEach(item => slotsToFilter.add(item.slot));

        return items.filter(item => !slotsToFilter.has(item.slot));
    }
);
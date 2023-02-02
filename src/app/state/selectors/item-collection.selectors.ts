import { createSelector } from "@ngrx/store";
import { Item, ItemSlot } from "../models/item-collection.models";
import { selectAll, selectEntities } from "../reducers/item-collection.reducers";
import * as fromFeature from "../reducers";


export const selectItemCollectionEntities = createSelector(
    fromFeature.selectItemCollectionState,
    state => selectEntities(state.items)
);

export const selectAllItems = createSelector(
    fromFeature.selectItemCollectionState,
    state => selectAll(state.items)
);

export const selectAllItemsByType = createSelector(
    selectAllItems,
    items => items.reduce((acc, item) => {
        acc[item.slot] ??= [];
        acc[item.slot].push(item);

        return acc;
    }, {} as Record<ItemSlot, Item[]>)
);
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { Item } from "../models/item-collection.models";
import * as itemCollectionActions from '../actions/item-collection.actions';
import * as suitCollectionActions from '../actions/suit-collection.actions';


export interface ItemCollectionState {
    items: EntityState<Item>;
    activeIds: number[];
    baselineItems: number[]
}

export const itemAdapter: EntityAdapter<Item> = createEntityAdapter<Item>({
    selectId: entity => entity.id,

    // Force a consistent order
    sortComparer: (a, b) => a.id - b.id,
});

export const initialState = {
    items: itemAdapter.getInitialState(),
    baselineItems: [],
    activeIds: []
} as ItemCollectionState;

export const reducer = createReducer(
    initialState,
    on(itemCollectionActions.UserActions.importSuccess, (state, { items }): ItemCollectionState => {
        return {
            ...state,
            items: itemAdapter.setAll(items, state.items)
        }
    }),
    on(itemCollectionActions.UserActions.selectItems, (state, { itemIds }): ItemCollectionState => {
        if (itemIds.length === 0 && state.activeIds.length === 0) { return state; }

        return {
            ...state,
            activeIds: itemIds
        }
    }),
    on(itemCollectionActions.UserActions.addBaselineItem, (state, { itemId }): ItemCollectionState => {
        return {
            ...state,
            baselineItems: [...state.baselineItems, itemId]
        }
    }),
    on(itemCollectionActions.UserActions.removeBaselineItem, (state, { itemId }): ItemCollectionState => {
        return {
            ...state,
            baselineItems: state.baselineItems.filter(id => id !== itemId)
        }
    }),
    on(suitCollectionActions.UserActions.setBaselineItems,
        itemCollectionActions.UserActions.setBaselineItems,
        (state, { items }): ItemCollectionState => {
            return {
                ...state,
                baselineItems: items
            }
        }
    ),
);

export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal
} = itemAdapter.getSelectors();

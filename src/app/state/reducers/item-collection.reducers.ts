import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { Item } from "../models/item-collection.models";
import * as fromActions from '../actions/item-collection.actions';


export interface ItemCollectionState {
    items: EntityState<Item>;
    activeIds: number[];
}

export const itemAdapter: EntityAdapter<Item> = createEntityAdapter<Item>({
    selectId: entity => entity.id,

    // Force a consistent order
    sortComparer: (a, b) => a.id - b.id,
});

export const initialState = {
    items: itemAdapter.getInitialState(),
} as ItemCollectionState;

export const reducer = createReducer(
    initialState,
    on(fromActions.UserActions.importSuccess, (state, { items }): ItemCollectionState => {
        return {
            ...state,
            items: itemAdapter.setAll(items, state.items)
        }
    }),
    on(fromActions.UserActions.selectItems, (state, { itemIds }): ItemCollectionState => {
        return {
            ...state,
            activeIds: itemIds
        }
    })
);

export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal
} = itemAdapter.getSelectors();

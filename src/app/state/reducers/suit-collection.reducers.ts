import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { Suit } from "../models/suit-collection.models";
import * as suitCollectionActions from '../actions/suit-collection.actions';
import * as suitBuilderActions from '../actions/suit-builder.actions';


export interface SuitCollectionState {
    suits: EntityState<Suit>;
    activeSuitId?: string;
    gridFilter: {};
}

export const itemAdapter: EntityAdapter<Suit> = createEntityAdapter<Suit>({
    selectId: entity => entity.id,
});

export const initialState = {
    suits: itemAdapter.getInitialState(),
} as SuitCollectionState;

export const reducer = createReducer(
    initialState,
    on(suitCollectionActions.Actions.initialize, (state): SuitCollectionState => {
        return {
            ...state,
            activeSuitId: null
        }
    }),
    on(suitCollectionActions.UserActions.selectSuit, (state, { suitId }): SuitCollectionState => {
        return {
            ...state,
            activeSuitId: suitId
        }
    }),
    on(suitBuilderActions.UserActions.buildSuccess, (state, { suits }): SuitCollectionState => {
        return {
            ...state,
            suits: itemAdapter.setAll(suits, state.suits)
        }
    }),
    on(suitCollectionActions.UserActions.updateGridFilter, (state, { gridFilter }): SuitCollectionState => {
        return {
            ...state,
            gridFilter
        }
    }),
);

export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal
} = itemAdapter.getSelectors();

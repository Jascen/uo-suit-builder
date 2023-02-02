import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { StatConfiguration } from "../models/suit-config.models";
import * as fromActions from '../actions/suit-config.actions';


export interface SuitConfigState {
    propertyOptions: EntityState<StatConfiguration>;
}

export const itemAdapter: EntityAdapter<StatConfiguration> = createEntityAdapter<StatConfiguration>({
    selectId: entity => entity.id,
});

export const initialState = {
    propertyOptions: itemAdapter.getInitialState(),
} as SuitConfigState;

export const reducer = createReducer(
    initialState,
    on(fromActions.Actions.initializeSuccess, (state, { configurationOptions }): SuitConfigState => {
        return {
            ...state,
            propertyOptions: itemAdapter.setAll(configurationOptions, state.propertyOptions)
        }
    })
);

export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal
} = itemAdapter.getSelectors();

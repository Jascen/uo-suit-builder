import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { StatConfiguration } from "../models/suit-config.models";
import * as fromActions from '../actions/suit-config.actions';


export interface SuitConfigState {
    propertyOptions: EntityState<StatConfiguration>;
    activeStatConfigurationId?: string;
}

export const itemAdapter: EntityAdapter<StatConfiguration> = createEntityAdapter<StatConfiguration>({
    selectId: entity => entity.id,
});

export const initialState = {
    propertyOptions: itemAdapter.getInitialState(),
} as SuitConfigState;

export const reducer = createReducer(
    initialState,
    on(fromActions.Actions.initialize, (state): SuitConfigState => {
        return {
            ...state,
            activeStatConfigurationId: null
        }
    }),
    on(
        fromActions.Actions.initializeSuccess,
        fromActions.UserActions.importProperties,
        (state, { properties }): SuitConfigState => {
            return {
                ...state,
                propertyOptions: itemAdapter.setAll(properties, state.propertyOptions)
            }
        }
    ),
    on(fromActions.UserActions.selectProperty, (state, { propertyId }): SuitConfigState => {
        return {
            ...state,
            activeStatConfigurationId: propertyId
        }
    }),
    on(fromActions.UserActions.saveSettings, (state, { properties }): SuitConfigState => {
        return {
            ...state,
            propertyOptions: itemAdapter.setMany(properties, state.propertyOptions)
        }
    }),
);

export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal
} = itemAdapter.getSelectors();

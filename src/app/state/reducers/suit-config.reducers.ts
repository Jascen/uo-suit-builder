import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { StatConfiguration } from "../models/suit-config.models";
import * as suitConfigActions from '../actions/suit-config.actions';
import * as itemCollectionActions from '../actions/item-collection.actions';


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
    on(suitConfigActions.Actions.initialize, (state): SuitConfigState => {
        return {
            ...state,
            activeStatConfigurationId: null
        }
    }),
    on(
        suitConfigActions.Actions.initializeSuccess,
        suitConfigActions.UserActions.importProperties,
        (state, { properties }): SuitConfigState => {
            return {
                ...state,
                propertyOptions: itemAdapter.setAll(properties, state.propertyOptions)
            }
        }
    ),
    on(suitConfigActions.UserActions.selectProperty, (state, { propertyId }): SuitConfigState => {
        return {
            ...state,
            activeStatConfigurationId: propertyId
        }
    }),
    on(itemCollectionActions.UserActions.buildApproved, (state, { properties }): SuitConfigState => {
        return {
            ...state,
            propertyOptions: itemAdapter.updateMany(properties.map(property => ({
                id: property.id,
                changes: {
                    minimum: property.minimum,
                    maximum: property.maximum,
                    scalingFactor: property.scalingFactor,
                    target: property.maximum
                }
            })), state.propertyOptions)
        }
    }),
    on(suitConfigActions.UserActions.saveSettings, (state, { properties }): SuitConfigState => {
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

import { createReducer, on } from "@ngrx/store";
import { Suit } from 'src/app/state/models/suit-collection.models';
import * as suitBuilderActions from '../actions/suit-builder.actions';


export interface SuitBuilderState {
    suits: Suit[]
}

export const initialState = {
} as SuitBuilderState;

export const reducer = createReducer(
    initialState,
    on(suitBuilderActions.UserActions.buildSuccess, (state, { suits }): SuitBuilderState => {
        return {
            ...state,
            suits
        }
    })
);
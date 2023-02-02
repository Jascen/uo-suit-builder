import { createReducer } from "@ngrx/store";


export interface SuitBuilderState {
}

export const initialState = {
} as SuitBuilderState;

export const reducer = createReducer(
    initialState,
);
import { createSelector } from "@ngrx/store";
import * as fromFeature from "../reducers";


export const selectAllSuits = createSelector(
    fromFeature.selectSuitBuilderState,
    state => state.suits
);
import { createSelector } from "@ngrx/store";
import { selectAll, selectEntities } from "../reducers/suit-collection.reducers";
import * as fromFeature from "../reducers";


export const selectLoaded = createSelector(
    fromFeature.selectSuitCollectionState,
    state => !!state.suits.ids.length
);

export const selectAllSuitEntities = createSelector(
    fromFeature.selectSuitCollectionState,
    state => selectEntities(state.suits)
);

export const selectAllSuits = createSelector(
    fromFeature.selectSuitCollectionState,
    state => selectAll(state.suits)
);

export const selectActiveSuit = createSelector(
    fromFeature.selectSuitCollectionState,
    selectAllSuitEntities,
    (state, entities) => state.activeSuitId ? entities[state.activeSuitId] : null
);

export const selectActiveSuitSummary = createSelector(
    selectActiveSuit,
    suit => suit?.summary
);
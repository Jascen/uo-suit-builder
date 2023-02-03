import { createSelector } from "@ngrx/store";
import { selectAll, selectEntities } from "../reducers/suit-config.reducers";
import * as fromFeature from "../reducers";


export const selectLoaded = createSelector(
    fromFeature.selectSuitConfigState,
    state => !!state.propertyOptions.ids.length
);

export const selectAllPropertyEntities = createSelector(
    fromFeature.selectSuitConfigState,
    state => selectEntities(state.propertyOptions)
);

export const selectAllProperties = createSelector(
    fromFeature.selectSuitConfigState,
    state => selectAll(state.propertyOptions)
);

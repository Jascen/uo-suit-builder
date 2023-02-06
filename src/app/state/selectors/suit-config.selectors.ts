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

export const selectAllPropertiesSorted = createSelector(
    selectAllProperties,
    properties => [...properties].sort((a, b) => a.name.localeCompare(b.name))
);

export const selectAllFilterableProperties = createSelector(
    selectAllProperties,
    properties => properties.filter(property => property.minimum || property.target)
);

export const selectActiveProperty = createSelector(
    fromFeature.selectSuitConfigState,
    selectAllPropertyEntities,
    (state, entities) => state.activeStatConfigurationId ? entities[state.activeStatConfigurationId] : null
);
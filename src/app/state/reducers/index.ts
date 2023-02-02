import { isDevMode } from '@angular/core';
import { ActionReducerMap, createFeatureSelector, MetaReducer } from '@ngrx/store';
import * as fromItemCollection from './item-collection.reducers'
import * as fromSuitBuilder from './suit-builder.reducers'
import * as fromSuitConfig from './suit-config.reducers'


export interface AppState {
  itemCollection: fromItemCollection.ItemCollectionState;
  suitBuilder: fromSuitBuilder.SuitBuilderState;
  suitConfig: fromSuitConfig.SuitConfigState;
}

export const reducers: ActionReducerMap<AppState> = {
  itemCollection: fromItemCollection.reducer,
  suitBuilder: fromSuitBuilder.reducer,
  suitConfig: fromSuitConfig.reducer,
};


export const metaReducers: MetaReducer<AppState>[] = isDevMode() ? [] : [];

export const selectItemCollectionState = createFeatureSelector<fromItemCollection.ItemCollectionState>('itemCollection');
export const selectSuitBuilderState = createFeatureSelector<fromSuitBuilder.SuitBuilderState>('suitBuilder');
export const selectSuitConfigState = createFeatureSelector<fromSuitConfig.SuitConfigState>('suitConfig');
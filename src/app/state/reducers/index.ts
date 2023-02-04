import { isDevMode } from '@angular/core';
import { ActionReducerMap, createFeatureSelector, MetaReducer } from '@ngrx/store';
import * as fromItemCollection from './item-collection.reducers'
import * as fromSuitCollection from './suit-collection.reducers'
import * as fromSuitBuilder from './suit-builder.reducers'
import * as fromSuitConfig from './suit-config.reducers'


export interface AppState {
  itemCollection: fromItemCollection.ItemCollectionState;
  suitCollection: fromSuitCollection.SuitCollectionState;
  suitBuilder: fromSuitBuilder.SuitBuilderState;
  suitConfig: fromSuitConfig.SuitConfigState;
}

export const reducers: ActionReducerMap<AppState> = {
  itemCollection: fromItemCollection.reducer,
  suitCollection: fromSuitCollection.reducer,
  suitBuilder: fromSuitBuilder.reducer,
  suitConfig: fromSuitConfig.reducer,
};


export const metaReducers: MetaReducer<AppState>[] = isDevMode() ? [] : [];

export const selectItemCollectionState = createFeatureSelector<fromItemCollection.ItemCollectionState>('itemCollection');
export const selectSuitCollectionState = createFeatureSelector<fromSuitCollection.SuitCollectionState>('suitCollection');
export const selectSuitBuilderState = createFeatureSelector<fromSuitBuilder.SuitBuilderState>('suitBuilder');
export const selectSuitConfigState = createFeatureSelector<fromSuitConfig.SuitConfigState>('suitConfig');
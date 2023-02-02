import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers, metaReducers } from './state/reducers';
import { effects } from './state/effects';
import { ItemCollectionComponent } from './views/item-collection/item-collection.component';
import { SuitBuilderComponent } from './views/suit-builder/suit-builder.component';
import { SuitConfigComponent } from './views/suit-config/suit-config.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AgGridModule } from 'ag-grid-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ItemCollectionGridComponent } from './views/item-collection/item-collection-grid/item-collection-grid.component';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { SuitCollectionComponent } from './views/suit-collection/suit-collection.component';
import { SuitCollectionGridComponent } from './views/suit-collection/suit-collection-grid/suit-collection-grid.component';

ModuleRegistry.registerModules([
  ClientSideRowModelModule
]);

@NgModule({
  declarations: [
    AppComponent,
    ItemCollectionComponent,
    SuitBuilderComponent,
    SuitConfigComponent,
    ItemCollectionGridComponent,
    SuitCollectionComponent,
    SuitCollectionGridComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot(effects),
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument(),
    AgGridModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

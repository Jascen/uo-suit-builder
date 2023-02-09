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
import { ItemCollectionGridComponent } from './components/item-collection-grid/item-collection-grid.component';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { SuitCollectionComponent } from './views/suit-collection/suit-collection.component';
import { SuitCollectionGridComponent } from './components/suit-collection-grid/suit-collection-grid.component';
import { SidenavComponent } from './views/sidenav/sidenav.component';
import { PropertyConfigurationComponent } from './views/property-configuration/property-configuration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PropertyConfigurationFormComponent } from './views/property-configuration/property-configuration-form/property-configuration-form.component';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PropertyConfigurationControlComponent } from './components/property-configuration-control/property-configuration-control.component';
import { DetailListComponent } from './components/detail-list/detail-list.component';
import { NgLetDirective } from './directives/ng-let.directive';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { BuildRequestSummaryDialogComponent } from './dialogs/build-request-summary-dialog/build-request-summary-dialog.component';
import { PropertyRangeControlComponent } from './components/property-range-control/property-range-control.component';
import { FileDragDropDirective } from './directives/file-drag-drop.directive';
import { FloatingGreaterThanOrEqualComponent } from './components-grid/floating-greater-than-or-equal/floating-greater-than-or-equal.component';
import { SuitSummaryComponent } from './components/suit-summary/suit-summary.component';


ModuleRegistry.registerModules([
  ClientSideRowModelModule
]);

@NgModule({
  declarations: [
    AppComponent,
    NgLetDirective,
    ItemCollectionComponent,
    SuitBuilderComponent,
    SuitConfigComponent,
    ItemCollectionGridComponent,
    SuitCollectionComponent,
    SuitCollectionGridComponent,
    SidenavComponent,
    PropertyConfigurationComponent,
    PropertyConfigurationFormComponent,
    PropertyConfigurationControlComponent,
    DetailListComponent,
    BuildRequestSummaryDialogComponent,
    PropertyRangeControlComponent,
    FileDragDropDirective,
    FloatingGreaterThanOrEqualComponent,
    SuitSummaryComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot(effects),
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument(),
    AgGridModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSliderModule,
    MatListModule,
    MatFormFieldModule,
    MatDialogModule,
    MatExpansionModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

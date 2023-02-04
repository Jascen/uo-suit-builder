import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemCollectionComponent } from './views/item-collection/item-collection.component';
import { PropertyConfigurationComponent } from './views/property-configuration/property-configuration.component';
import { SuitCollectionComponent } from './views/suit-collection/suit-collection.component';

const routes: Routes = [
  { path: 'builder', component: ItemCollectionComponent, },
  { path: 'review', component: SuitCollectionComponent, },
  { path: 'settings', component: PropertyConfigurationComponent, },
  { path: '**', redirectTo: 'builder', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

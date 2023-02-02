import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemCollectionComponent } from './views/item-collection/item-collection.component';
import { SuitCollectionComponent } from './views/suit-collection/suit-collection.component';

const routes: Routes = [
  { path: 'items', component: ItemCollectionComponent, },
  { path: 'suits', component: SuitCollectionComponent, },
  { path: '**', redirectTo: 'items', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

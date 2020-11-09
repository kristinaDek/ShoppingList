import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListToPage } from './list-to.page';

const routes: Routes = [
  {
    path: '',
    component: ListToPage
  },
  {
    path: ':id',
    loadChildren: () => import('./item-details/item-details.module').then( m => m.ItemDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListToPageRoutingModule {}

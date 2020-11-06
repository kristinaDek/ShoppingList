import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListToPage } from './list-to.page';

const routes: Routes = [
  {
    path: '',
    component: ListToPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListToPageRoutingModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DonePageRoutingModule } from './done-routing.module';

import { DonePage } from './done.page';
import {ListToPageModule} from '../list-to.module';

import { Ng2SearchPipeModule } from 'ng2-search-filter';

import {ItemDoneElementComponent} from '../../../item-done-element/item-done-element.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DonePageRoutingModule,
    ListToPageModule,
    Ng2SearchPipeModule
  ],
  declarations: [DonePage, ItemDoneElementComponent],
  exports: [
    ItemDoneElementComponent
  ],
  entryComponents: [ItemDoneElementComponent]
})
export class DonePageModule {}

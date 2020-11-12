import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListToPageRoutingModule } from './list-to-routing.module';

import { ListToPage } from './list-to.page';
import {ItemElementComponent} from '../../item-element/item-element.component';
import {ItemModalComponent} from '../item-modal/item-modal.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ListToPageRoutingModule
    ],
    declarations: [ListToPage, ItemElementComponent, ItemModalComponent],
    exports: [
        ItemElementComponent
    ],
    entryComponents: [ItemModalComponent]
})
export class ListToPageModule {}

import { Component, OnInit } from '@angular/core';
import {ItemModel} from './item.model';
import {ModalController} from '@ionic/angular';
import {ItemModalComponent} from '../item-modal/item-modal.component';
import {ListService} from '../list.service';


@Component({
  selector: 'app-list-to',
  templateUrl: './list-to.page.html',
  styleUrls: ['./list-to.page.scss'],
})
export class ListToPage implements OnInit {
  items: ItemModel[] = [{ id: 'i1', author: 'Kris', title: 'kupi svesku', text: 'knjizara', checked: false, type: 'school'}];

  constructor(private modalCtrl: ModalController, private listService: ListService) { }

  ngOnInit() {
    console.log('ngOnInit');
    this.listService.items.subscribe((items) => {
      this.items = items;
    });
  }

  ionViewWillEnter(){
    this.listService.getItems().subscribe((items) => {
      // this.items = items;
    });
  }

  openModal() {
    this.modalCtrl.create({
      component: ItemModalComponent,
      componentProps: {name: 'Add new item'},
    }).then( (modal) => {
      modal.present();
      return modal.onDidDismiss();
    }).then((resultData) => {
      if (resultData.role === 'confirm')
      {
        // tslint:disable-next-line:max-line-length
        console.log(resultData);
        // tslint:disable-next-line:max-line-length
        this.listService.addItem(resultData.data.itemData.title, resultData.data.itemData.text, resultData.data.itemData.author, resultData.data.itemData.checked, resultData.data.itemData.type)
            .subscribe(items => {
              console.log(items);
              // this.items = items;
            });
      }
    });
  }
}

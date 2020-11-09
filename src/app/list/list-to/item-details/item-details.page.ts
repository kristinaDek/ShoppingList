import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LoadingController, ModalController, NavController} from '@ionic/angular';
import {ListService} from '../../list.service';
import {ItemModel} from '../item.model';
import {ItemModalComponent} from '../../item-modal/item-modal.component';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.page.html',
  styleUrls: ['./item-details.page.scss'],
})
export class ItemDetailsPage implements OnInit {
  item: ItemModel = { id: 'i1', author: 'Kris', title: 'kupi svesku', text: 'knjizara', checked: false, type: 'school'};
  isLoading = false;
  // tslint:disable-next-line:max-line-length
  constructor(private route: ActivatedRoute, private navCtrl: NavController, private listService: ListService, private loadingCtrl: LoadingController, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('id')){
        this.navCtrl.navigateBack('/list-to');
        return;
      }
      this.isLoading = true;
      this.listService.getItem(paramMap.get('id')).subscribe( (item) => {
        this.item = item;
        this.isLoading = false;
      });
    });
  }

    onEditItem() {
      this.modalCtrl.create({
        component: ItemModalComponent,
        componentProps: {name: 'Edit item', title: this.item.title, type: this.item.type, text: this.item.text}
      }).then((modal) => {
        modal.present();
        return modal.onDidDismiss();
      }).then((resultData) => {
        if (resultData.role === 'confirm') {
          console.log(resultData);
          this.loadingCtrl.create({message: 'Editing...'}).then(loadingEl => {
            loadingEl.present();
            this.listService
                .editItem(
                    this.item.id,
                    resultData.data.itemData.title,
                    resultData.data.itemData.text,
                    resultData.data.itemData.author,
                    resultData.data.itemData.checked,
                    resultData.data.itemData.type,
                    )
                .subscribe((res) => {
                  this.item.title = resultData.data.itemData.title;
                  this.item.text = resultData.data.itemData.text;
                  this.item.type = resultData.data.itemData.type;
                  loadingEl.dismiss();
                });

          });
        }
      });
    }

  onDeleteItem() {
    this.loadingCtrl.create({message: 'Deleting...'}).then(loadingEl => {
      loadingEl.present();
      this.listService.deleteItem(this.item.id).subscribe(() => {
        loadingEl.dismiss();
        this.navCtrl.navigateBack('/list-to');
      });
    });
  }
}

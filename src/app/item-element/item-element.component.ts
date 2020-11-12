import {Component, Input, OnInit} from '@angular/core';
import {ItemModel} from '../list/list-to/item.model';
import {ListService} from '../list/list.service';
import {LoadingController} from '@ionic/angular';

@Component({
  selector: 'app-item-element',
  templateUrl: './item-element.component.html',
  styleUrls: ['./item-element.component.scss'],
})
export class ItemElementComponent implements OnInit {
  @Input() item: ItemModel;
  constructor(private listService: ListService, private loadingCtrl: LoadingController) { }

  ngOnInit() {}

    alterCheck(i: ItemModel) {
      if (i.checked){
          this.loadingCtrl.create({message: 'Unchecking'}).then(loadingEl => {
              loadingEl.present();
              this.listService.checkOrUncheckItem(i)
                  .subscribe((res) => {
                      console.log('undone');
                      loadingEl.dismiss();
                  });
          });
      }else {
          this.loadingCtrl.create({message: 'Checking'}).then(loadingEl => {
              loadingEl.present();
              this.listService.checkOrUncheckItem(i)
                  .subscribe((res) => {
                      console.log('done');
                      loadingEl.dismiss();
                  });
          });
      }
    }
}

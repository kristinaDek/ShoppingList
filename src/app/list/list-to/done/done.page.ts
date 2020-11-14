import {Component, OnDestroy, OnInit} from '@angular/core';
import {ListService} from '../../list.service';
import {ItemModel} from '../item.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-done',
  templateUrl: './done.page.html',
  styleUrls: ['./done.page.scss'],
})
export class DonePage implements OnInit, OnDestroy {
  items: ItemModel[] = [];
  private itemsSub: Subscription;
  filterTerm: string;
  constructor(private listService: ListService) { }

  ngOnInit() {
    console.log('ngOnInit');
    this.itemsSub = this.listService.doneItems.subscribe((items) => {

      this.items = items;
    });
  }

  ionViewWillEnter(){
    this.listService.getDoneItems().subscribe((items) => {
      console.log('ionViewWillEnter');
      console.log(items);
      // this.items = items;
    });
  }
  ngOnDestroy(): void {
    console.log('ngOnDestroy');
    if (this.itemsSub){
      this.itemsSub.unsubscribe();
    }
  }

}

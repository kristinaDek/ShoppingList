import {Component, Input, OnInit} from '@angular/core';
import {ItemModel} from '../list/list-to/item.model';

@Component({
  selector: 'app-item-element',
  templateUrl: './item-element.component.html',
  styleUrls: ['./item-element.component.scss'],
})
export class ItemElementComponent implements OnInit {
  @Input() item: ItemModel = { id: 'i1', type: 'school', title: 'kupi svesku', checked: false, author: 'Kris', text: 'kupi svesku'};
  constructor() { }

  ngOnInit() {}

}

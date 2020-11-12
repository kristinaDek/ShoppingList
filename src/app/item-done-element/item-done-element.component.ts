import {Component, Input, OnInit} from '@angular/core';
import {ItemModel} from '../list/list-to/item.model';

@Component({
  selector: 'app-item-done-element',
  templateUrl: './item-done-element.component.html',
  styleUrls: ['./item-done-element.component.scss'],
})
export class ItemDoneElementComponent implements OnInit {
  @Input() item: ItemModel;
  constructor() { }

  ngOnInit() {}

}

import { Injectable } from '@angular/core';
import {ItemModel} from './list-to/item.model';
import {HttpClient} from '@angular/common/http';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';

interface ItemData {
  author: string;
  title: string;
  text: string;
  type: string;
  checked: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ListService {
  // tslint:disable-next-line:variable-name
  private _items = new BehaviorSubject<ItemModel[]>([]);
  constructor(private httpClient: HttpClient) { }

  get items(){
    return this._items.asObservable();
  }

  addItem(title: string, text: string, author: string, checked: boolean, type: string){
    let generatedId;

    return this.httpClient.post<{name: string}>('https://shoppydb-1c165.firebaseio.com/items.json', {title, text, author, checked, type}).
    pipe(switchMap((resultData) => {
      generatedId = resultData.name;
      return this.items;
    }), take(1), tap((items) => {
      this._items.next(items.concat({
        id: generatedId,
        title,
        text,
        author,
        checked: false,
        type,
      }));
    }));
  }

  getItems() {
    return this.httpClient
        .get<{ [key: string]: ItemData }>(
            `https://shoppydb-1c165.firebaseio.com/items.json`
        ).pipe(map((itemsData) => {
          console.log(itemsData);
          const items: ItemModel[] = [];
          for (const key in itemsData)
          {
            if (itemsData.hasOwnProperty(key)){
              items.push({
                author: '',
                id: key,
                title: itemsData[key].title,
                text: itemsData[key].text,
                type: itemsData[key].type,
                checked: itemsData[key].checked,
              });
            }
          }
          this._items.next(items);
          return items;
        }));
  }
}

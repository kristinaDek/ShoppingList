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

          return items;
        }), tap( items => {
          this._items.next(items); }));
  }

  getItem(id: string){
    return this.httpClient.get<ItemData>(`https://shoppydb-1c165.firebaseio.com/items/${id}.json`)
        .pipe(map((resultData) => {
      console.log(resultData);
      return{
        id,
        title: resultData.title,
        text: resultData.text,
        author: resultData.author,
        checked: resultData.checked,
        type: resultData.type,
      };
    }));
  }

  deleteItem(id: string) {
    return this.httpClient
            .delete(`https://quotes-app-11-termin.firebaseio.com/quotes/${id}.json`).
        pipe(switchMap(() => {
        return this.items;
      }),
      take(1),
      tap((items) => {
        this._items.next(items.filter((item) => item.id !== id));
      }));
  }

  editItem(id: string, title: string, text: string, author: string,  checked: boolean, type: string) {

    return this.httpClient
            .put(`https://quotes-app-11-termin.firebaseio.com/quotes/${id}.json`, {title, text, author, checked, type})
        .pipe( switchMap(() => this.items),
        take(1),
        tap((items) => {
          const updatedItemIndex = items.findIndex((item) => item.id === id);
          const updatedItems = [...items];
          updatedItems[updatedItemIndex] = {
              id,
              title,
              text,
              author,
              checked,
              type};
          this._items.next(updatedItems);
        })
    );

  }

  checkOrUncheckItem(id: string, b: boolean) {
    // this.items.update(id, {checked: b});
    console.log('uspelo');
  }
}

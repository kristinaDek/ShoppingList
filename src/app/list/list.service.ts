import { Injectable } from '@angular/core';
import {ItemModel} from './list-to/item.model';
import {HttpClient} from '@angular/common/http';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from '../auth/auth.service';

interface ItemData {
  author: string;
  title: string;
  text: string;
  type: string;
  checked: boolean;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ListService {
  // tslint:disable-next-line:variable-name
  private _items = new BehaviorSubject<ItemModel[]>([]);
  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  get items(){
    return this._items.asObservable();
  }

  addItem(title: string, text: string, author: string, checked: boolean, type: string){
    let generatedId;
    let newItem: ItemModel;

    return this.authService.userId.pipe(
          take(1),
          switchMap((userId) => {
              newItem = new ItemModel(
                  null,
                  title,
                  text,
                  userId,
                  type,
                  false,
                  userId
              );

              return this.httpClient
                  .post<{ name: string }>(
                      `https://shoppydb-1c165.firebaseio.com/items.json`,
                      newItem
                  );
          }),
        switchMap((resData) => {
            generatedId = resData.name;
            return this.items;
        }),
        take(1), tap((items) => {
              newItem.id = generatedId;
              this._items.next(items.concat(newItem));
            }));
  }
   getItems() {
       return this.authService.userId.pipe(
           take(1),
           switchMap((token) => {
            return this.httpClient
                .get<{ [key: string]: ItemData }>(
                    `https://shoppydb-1c165.firebaseio.com/items.json`
                ); }),
            map((itemsData) => {
                  console.log(itemsData);
                  const items: ItemModel[] = [];
                  for (const key in itemsData)
                  {
                    if (itemsData.hasOwnProperty(key)){
                        // tslint:disable-next-line:max-line-length
                      items.push(new ItemModel(key, itemsData[key].title, itemsData[key].text, itemsData[key].author, itemsData[key].type, itemsData[key].checked, itemsData[key].userId));

                    }
                  }
                  return items.sort((a: any, b: any) => a.checked - b.checked);
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
        userId: resultData.userId,
      };
    }));
  }

  deleteItem(id: string) {
    return this.httpClient
            .delete(`https://shoppydb-1c165.firebaseio.com/items/${id}.json`).
        pipe(switchMap(() => {
        return this.items;
      }),
      take(1),
      tap((items) => {
        this._items.next(items.filter((item) => item.id !== id));
      }));
  }

  editItem(id: string, title: string, text: string, author: string, type: string, checked: boolean, userId: string) {

    return this.httpClient
            .put(`https://shoppydb-1c165.firebaseio.com/items/${id}.json`, {title, text, author,  type, checked, userId})
        .pipe( switchMap(() => this.items),
        take(1),
        tap((items) => {
          const updatedItemIndex = items.findIndex((item) => item.id === id);
          const updatedItems = [...items];
          updatedItems[updatedItemIndex] = new ItemModel(id, title, text, author, type, checked, userId);
          this._items.next(updatedItems);
        })
    );

  }

  checkOrUncheckItem(it: ItemModel) {
    // this.items.update(id, {checked: b});
    console.log('uspelo');
    const id = it.id;
    const title = it.title;
    const text = it.text;
    const type = it.type;
    const author = it.author;
    const checked = !it.checked;
    const userId = it.userId;

    return this.httpClient
        .put(`https://shoppydb-1c165.firebaseio.com/items/${id}.json`, {title, text, author, checked, type, userId})
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
                    type,
                  userId};
              this._items.next(updatedItems);
            })
        );
  }
}

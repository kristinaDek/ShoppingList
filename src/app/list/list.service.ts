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
    let fetchedUserId: string;

    return this.authService.userId.pipe(
        take(1),
        switchMap(userId => {
            fetchedUserId = userId;
            return this.authService.token;
        }),
          take(1),
          switchMap((token) => {
              newItem = new ItemModel(
                  null,
                  title,
                  text,
                  fetchedUserId,
                  type,
                  false,
                  fetchedUserId
              );

              return this.httpClient
                  .post<{ name: string }>(
                      `https://shoppydb-1c165.firebaseio.com/items.json?auth=${token}`,
                      newItem
                  );
          }),
        switchMap((resData) => {
            generatedId = resData.name;
            return this.items;
        }),
        take(1),
        tap((items) => {
              newItem.id = generatedId;
              this._items.next(
                  items.concat(newItem)
              );
            }));
  }
   getItems() {
       return this.authService.token.pipe(
           take(1),
           switchMap((token) => {
            return this.httpClient
                .get<{ [key: string]: ItemData }>(
                    `https://shoppydb-1c165.firebaseio.com/items.json?auth=${token}`
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
        }),
          tap( items => {
            this._items.next(items); }));
  }

  getItem(id: string){
      return this.authService.token.pipe(
          take(1),
          switchMap((token) => {
              return this.httpClient.get<ItemData>(`https://shoppydb-1c165.firebaseio.com/items/${id}.json?auth=${token}`);
          }),
          map((resultData) => {
      console.log(resultData);
      return new ItemModel(
          id,
          resultData.title,
          resultData.text,
          resultData.author,
          resultData.type,
          resultData.checked,
          resultData.userId
      );

      })
    );
  }

    deleteItem(id: string){

        return this.authService.token.pipe(
        take(1),
        switchMap((token) => {
            return this.httpClient
                .delete(`https://shoppydb-1c165.firebaseio.com/items/${id}.json?auth=${token}`);
        }),
        switchMap(() => {
            return this.items;
          }),
          take(1),
          tap((items) => {
            this._items.next(items.filter((item) => item.id !== id));
          }));
      }

    editItem(id: string, title: string, text: string, author: string, type: string, checked: boolean, userId: string) {


        return this.authService.token.pipe(
            take(1),
            switchMap((token) => {
                return this.httpClient
                    .put(`https://shoppydb-1c165.firebaseio.com/items/${id}.json?auth=${token}`, {
                        title, text, author,  type, checked, userId});
            }),
        switchMap(() => this.items),
            take(1),
            tap((items) => {
              const updatedItemIndex = items.findIndex((item) => item.id === id);
              const updatedItems = [...items];
              updatedItems[updatedItemIndex] = new ItemModel(id, title, text, author, type, checked, userId);
              this._items.next(updatedItems);
            })
        );

      }

    checkOrUncheckItem(it: ItemModel){
        // this.items.update(id, {checked: b});
        console.log('uspelo');
        const id = it.id;
        const title = it.title;
        const text = it.text;
        const type = it.type;
        const author = it.author;
        const checked = !it.checked;
        const userId = it.userId;

        return this.authService.token.pipe(
            take(1),
            switchMap((token) => {
                return this.httpClient
                    .put(`https://shoppydb-1c165.firebaseio.com/items/${id}.json?auth=${token}`, {
                        title, text, author,  type, checked, userId});
            }),
            switchMap(() => this.items),
                take(1),
                tap((items) => {
                  const updatedItemIndex = items.findIndex((item) => item.id === id);
                  const updatedItems = [...items];
                  updatedItems[updatedItemIndex] = new ItemModel(id, title, text, author, type, checked, userId);
                  this._items.next(updatedItems);
                })
            );
      }
    }

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs';

import {User} from './user.model';
import {map, tap} from 'rxjs/operators';


export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    localId: string;
    expiresIn: string;
}

export interface UserData {
    name?: string;
    surname?: string;
    email: string;
    password: string;

}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // tslint:disable-next-line:variable-name
    private _isUserAuthenticated = false;
    // tslint:disable-next-line:variable-name
    private _user = new BehaviorSubject<User>( null);

    constructor(private httpClient: HttpClient) { }

    get isUserAuthenticated(){
        return this._user.asObservable().pipe(
            map((user) => {
                if (user) {
                    return !!user.token;
                } else {
                    return false;
                }
            })
        );
    }

    get userData(){
        return this._user.asObservable().pipe(
            map((user) => {
                if (user) {
                    return user;
                } else {
                    return null;
                }
            })
        );
    }

    get userId() {
        return this._user.asObservable().pipe(
            map((user) => {
                if (user) {
                    return user.id;
                } else {
                    return null;
                }
            })
        );
    }

    get token() {
        return this._user.asObservable().pipe(
            map((user) => {
                if (user) {
                    return user.token;
                } else {
                    return null;
                }
            })
        );
    }

    logIn(user: UserData)
    {
      this._isUserAuthenticated = true;
      return this.httpClient.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
            {
                email: user.email,
                password: user.password,
                returnSecureToken: true
            }).pipe(tap(userData => {
          const expirationDate = new Date(new Date().getTime() + +userData.expiresIn * 1000);
          const newUser = new User(userData.localId, user.name, user.surname, userData.email, userData.idToken, expirationDate);
          this._user.next(newUser);
      }));
    }

    logOut()
    {
        this._user.next(null);
    }

    register(user: UserData){
        this._isUserAuthenticated = true;
        return this.httpClient.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`, {
            name: user.name,
            surname: user.surname,
            email: user.email,
            password: user.password,
            returnSecureToken: true
        }).pipe(tap(userData => {
            const expirationDate = new Date(new Date().getTime() + +userData.expiresIn * 1000);
            const newUser = new User(userData.localId, user.name, user.surname, userData.email, userData.idToken, expirationDate);
            this._user.next(newUser);
        }));
    }


    // resetPassword(email: string): Promise<void> {
    //     return firebase.auth().sendPasswordResetEmail(email);
    // }
}

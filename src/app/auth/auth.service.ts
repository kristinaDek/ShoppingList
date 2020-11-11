import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs';
import {__values} from 'tslib';
import {User} from './user.model';
import {tap} from 'rxjs/operators';

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

    get isUserAuthenticated(): boolean{
      return this._isUserAuthenticated;
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
          const newUser = new User(userData.localId, userData.email, userData.idToken, expirationDate);
          this._user.next(newUser);
      }));
    }

    logOut()
    {
      this._isUserAuthenticated = false;
    }

    register(user: UserData){
        this._isUserAuthenticated = true;
        return this.httpClient.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`, {
            email: user.email,
            password: user.password,
            returnSecureToken: true
        }).pipe(tap(userData => {
            const expirationDate = new Date(new Date().getTime() + +userData.expiresIn * 1000);
            const newUser = new User(userData.localId, userData.email, userData.idToken, expirationDate);
            this._user.next(newUser);
        }));
    }
}

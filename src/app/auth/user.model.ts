export class User {
    // tslint:disable-next-line:variable-name max-line-length
    constructor(public id: string, public name: string, public surname: string, public email: string, private _token: string, private tokenExpirationDate: Date) {
    }

    get token() {
        if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
            return null;
        }
        return this._token;
    }

    get Id() {
        if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
            return null;
        }
        return this.id;
    }
    get expires() {
        if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
            return null;
        }
        return this.tokenExpirationDate;
    }
}

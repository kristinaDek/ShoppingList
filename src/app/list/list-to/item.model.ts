export class ItemModel {
    constructor(
         public id: string,
         public title: string,
         public text: string,
         public author: string,
         public type: string,
         public checked: boolean,
         public userId: string
         ) {}
}

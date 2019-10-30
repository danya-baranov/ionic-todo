import { ObjectID } from 'typeorm';
export class PhotoDto {
    readonly id: ObjectID;
    readonly image: any;
}

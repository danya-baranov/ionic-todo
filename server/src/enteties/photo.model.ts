import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class Photo {
    @ObjectIdColumn()
    // tslint:disable-next-line: variable-name
    _id: string;

    @Column()
    itemId: string;

    @Column()
    photo: string;
}

import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity()
export class Item {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    title: string;

    @Column()
    text: string;

    @Column()
    photos: any;

    @Column()
    completed: boolean;

    @Column()
    latLng: {
        lat: number,
        lng: number,
    };

    @Column()
    userId: string;
}

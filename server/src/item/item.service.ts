import { Photo } from '../models/photo.model';
import { ItemDto } from '../DTO/item.dto';
import { Injectable } from '@nestjs/common';
import { Item } from '../models/item.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectID, getConnection } from 'typeorm';

@Injectable()
export class ItemService {

    constructor(
        @InjectRepository(Item) private itemRepository: Repository<Item>,
        @InjectRepository(Photo) private photoRepository: Repository<Photo>,
    ) { }

    public async getItems(id): Promise<Item[]> {
        const item = await this.itemRepository.find({
            where: {
                userId: String(id),
            },
        });
        return item;
    }

    async getItem(id: ObjectID): Promise<Item | undefined> {
        return await this.itemRepository.findOne(id);
    }

    async addItem(item: ItemDto): Promise<Item> {
        const savedItem = await this.itemRepository.save(item);
        // save images
        const images = savedItem.photos;
        images.forEach(x => {
            x.itemId = savedItem.id;
        });
        images.forEach(a => {
            const dat = {
                itemId: String(a.itemId),
            };
            this.photoRepository.update(a._id, dat);
        });
        return savedItem;
    }

    async updateItem(id: ObjectID, item: Item) {
        return await this.itemRepository.update(id, item);
    }

    async deleteItemId(id: string) {
        const res = await this.itemRepository.delete(id);
        if (res) {
            const photos = await this.photoRepository.find({
                itemId: id,
            });
            photos.forEach(a => {
                const name = a.photo;
                const fs = require('fs');
                const file = 'uploads/';
                // tslint:disable-next-line: only-arrow-functions
                fs.unlink(file + name, function (err) {
                    // tslint:disable-next-line: no-console
                    console.error(err, ' Eror unlinka');
                });
            });
            await this.photoRepository.remove(photos);
        }
        return res;
    }
}

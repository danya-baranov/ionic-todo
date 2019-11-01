import { ItemViewModel } from './../view-models/item.view-model';
import { Photo } from '../enteties/photo.model';
import { Injectable } from '@nestjs/common';
import { Item } from '../enteties/item.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectID } from 'typeorm';

@Injectable()
export class ItemService {

    constructor(
        @InjectRepository(Item) private itemRepository: Repository<Item>,
        @InjectRepository(Photo) private photoRepository: Repository<Photo>,
    ) { }

    async getItems(id): Promise<Item[]> {
        const item = await this.itemRepository.find({
            where: {
                userId: String(id),
            },
        });
        return item;
    }

    async getItem(id: ObjectID): Promise<ItemViewModel> {
        const res = await this.itemRepository.findOne(id);
        const itemViewModel = new ItemViewModel();
        itemViewModel.id = res.id.toString();
        itemViewModel.title = res.title;
        itemViewModel.text = res.text;
        itemViewModel.photos = res.photos;
        itemViewModel.latLng = res.latLng;
        itemViewModel.completed = res.completed;
        itemViewModel.userId = res.userId;
        return itemViewModel;
    }

    async addItem(item: ItemViewModel): Promise<ItemViewModel> {
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

        const itemViewModel = new ItemViewModel();
        itemViewModel.id = savedItem.id.toString();
        itemViewModel.title = savedItem.title;
        itemViewModel.text = savedItem.text;
        itemViewModel.photos = savedItem.photos;
        itemViewModel.latLng = savedItem.latLng;
        itemViewModel.completed = savedItem.completed;
        itemViewModel.userId = savedItem.userId;

        return itemViewModel;
    }

    async updateItem(id: string, item: ItemViewModel) {
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
                fs.unlink(file + name, function(err) {
                    // tslint:disable-next-line: no-console
                    console.error(err, 'Error unlink');
                });
            });
            await this.photoRepository.remove(photos);
        }
        return res;
    }
}

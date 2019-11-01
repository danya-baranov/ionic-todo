import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectID } from 'typeorm';
import { Photo } from '../../enteties/photo.model';
import { fileURLToPath } from 'url';

@Injectable()
export class PhotoService {
    constructor(
        @InjectRepository(Photo) private photoRepository: Repository<Photo>,
        ) {}

    async addPhotoToItem(id: ObjectID, photo: Photo) {
        const photoToSave = {
            itemId: id,
            photo: photo[0].filename,
        } as any;
        const res = await this.photoRepository.save(photoToSave);
        return res;
    }

    async getPhotoToItem(): Promise<Photo[]> {
        const res = await this.photoRepository.find();
        return res;
    }

    async getPhotoToItemById(id: ObjectID): Promise<Photo | undefined> {
        return await this.photoRepository.findOne(id);
    }

    async deletePhoto(id: string, namePhoto) {
        const name = namePhoto.namePhoto;
        const fs = require('fs');
        const file = 'uploads/';
        // tslint:disable-next-line: only-arrow-functions
        fs.unlink(file + name, function(err) {
            // tslint:disable-next-line: no-console
            console.error(err, ' Eror unlinka');
        });
        return await this.photoRepository.delete(id);
    }
}

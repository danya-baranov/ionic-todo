import { PhotoDto } from './../../DTO/photo.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from '../../enteties/photo.model';
import { PhotoViewModel } from 'src/view-models/photo.view-model';

@Injectable()
export class PhotoService {
    constructor(
        @InjectRepository(Photo) private photoRepository: Repository<Photo>,
        ) {}

    async addPhotoToItem(id: string, photo: PhotoDto) {
        const photoToSave = {
            itemId: id,
            photo: photo[0].filename,
        } as any;
        const res = await this.photoRepository.save(photoToSave);
        return res;
    }

    async getPhotoToItem(): Promise<PhotoViewModel[]> {
        const res = await this.photoRepository.find();
        return res as PhotoViewModel[];
    }

    async getPhotoToItemById(id: string): Promise<PhotoViewModel> {
        return await this.photoRepository.findOne(id) as PhotoViewModel;
    }

    async deletePhoto(id: string, namePhoto) {
        const name = namePhoto.namePhoto;
        const fs = require('fs');
        const file = 'uploads/';
        // tslint:disable-next-line: only-arrow-functions
        fs.unlink(file + name, function(err) {
            // tslint:disable-next-line: no-console
            console.error(err, 'Error unlink');
        });
        return await this.photoRepository.delete(id);
    }
}

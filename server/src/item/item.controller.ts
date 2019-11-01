import { ItemViewModel } from './../view-models/item.view-model';
import { PhotoService } from './photo/photo.service';
import { ObjectID } from 'typeorm';
import { Controller, Get, Param, Post, Body, Put, Delete, UseInterceptors, UploadedFiles, Res, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ItemService } from './item.service';
import { MulterOptions } from '../LoadConfg/multer-config';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('item')
export class ItemController {

    constructor(
        private itemService: ItemService,
        private photoService: PhotoService,
    ) { }

    @Get()
    async getItems(@Req() req) {
        const user = req.user;
        return await this.itemService.getItems(user.id);
    }

    @Get('getPhotos')
    async getPhotos() {
        return await this.photoService.getPhotoToItem();
    }

    @Get('getPhotos/:id')
    async getPhoto(@Param('id') id: ObjectID) {
        return await this.photoService.getPhotoToItemById(id);
    }

    @Post()
    async create(@Body() item: ItemViewModel) {
        return await this.itemService.addItem(item);
    }

    @Post('upload/:id')
    @UseInterceptors(AnyFilesInterceptor(MulterOptions))
    async uploadFile(@UploadedFiles() photo, @Param('id') id: ObjectID, @Res() res) {
        const result = await this.photoService.addPhotoToItem(id, photo);
        res.status(HttpStatus.OK).json({ result });

    }

    @Post('deletePhotos/:photoId')
    async deletePhoto(@Param('photoId') id: string, @Body() namePhoto: string) {
        return await this.photoService.deletePhoto(id, namePhoto);
    }

    @Put(':id')
    async update(@Param('id') id: ObjectID, @Body() item: ItemViewModel) {
        return await this.itemService.updateItem(id, item);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.itemService.deleteItemId(id);
    }

}

import { PhotoService } from './photo/photo.service';
import { ItemDto } from '../DTO/item.dto';
import { ObjectID } from 'typeorm';
import { Controller, Get, Param, Post, Body, Put, Delete, UseInterceptors, UploadedFiles, Res, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ItemService } from './item.service';
import { Item } from '../enteties/item.model';
import { MulterOptions } from '../LoadConfg/multer-config';
import { AuthGuard } from '@nestjs/passport';

@Controller('item')
export class ItemController {

    constructor(
        private itemService: ItemService,
        private photoService: PhotoService,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getItems(@Req() req) {
        const user = req.user;
        return await this.itemService.getItems(user.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Body() item: ItemDto) {
        return await this.itemService.addItem(item);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('getPhotos')
    async getPhotos() {
        return await this.photoService.getPhotoToItem();
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(@Param('id') id: ObjectID, @Body() item: Item) {
        return await this.itemService.updateItem(id, item);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.itemService.deleteItemId(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('upload/:id')
    @UseInterceptors(AnyFilesInterceptor(MulterOptions))
    async uploadFile(@UploadedFiles() photo, @Param('id') id: ObjectID, @Res() res) {
        const result = await this.photoService.addPhotoToItem(id, photo);
        res.status(HttpStatus.OK).json({ result });

    }

    @UseGuards(AuthGuard('jwt'))
    @Get('getPhotos/:id')
    async getPhoto(@Param('id') id: ObjectID) {
        return await this.photoService.getPhotoToItemById(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('deletePhotos/:photoId')
    async deletePhoto(@Param('photoId') id: string, @Body() namePhoto: any) {
        return await this.photoService.deletePhoto(id, namePhoto);
    }
}

import { User } from './models/user.model';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemService } from './item/item.service';
import { ItemController } from './item/item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './models/item.model';
import { MulterModule } from '@nestjs/platform-express';
import { PhotoService } from './item/photo/photo.service';
import { Photo } from './models/photo.model';

import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb+srv://local:12345@cluster0-xr3ji.mongodb.net/items',
      entities: [__dirname + '/**/*.model{.ts,.js}'],
      synchronize: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    TypeOrmModule.forFeature([Item, Photo]),
    MulterModule.register({
      dest: 'uploads/',
    }),
    UsersModule,
  ],
  controllers: [AppController, ItemController],
  providers: [AppService, ItemService, PhotoService],
})
export class AppModule { }

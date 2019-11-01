import { UserViewModel } from './../view-models/user.view-model';
import { User } from './../enteties/user.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private UserRepository: Repository<User>) { }

    async findByEmail(email: string): Promise<UserViewModel> {
        const res = await this.UserRepository.findOne({
            where: {
                email,
            },
        });
        const userViewModel = new UserViewModel();
        userViewModel.id = res.id.toString();
        userViewModel.name = res.name;
        userViewModel.email = res.email;
        userViewModel.password = res.password;

        return userViewModel;
    }

    async findById(id: string): Promise<UserViewModel> {
        const res = await this.UserRepository.findOne(id);
        const userViewModel = new UserViewModel();
        userViewModel.id = res.id.toString();
        userViewModel.name = res.name;
        userViewModel.email = res.email;
        userViewModel.password = res.password;
        return userViewModel;
    }

    async create(user: User): Promise<UserViewModel> {
        const res = await this.UserRepository.save(user);
        const userViewModel = new UserViewModel();
        userViewModel.id = res.id.toString();
        userViewModel.name = res.name;
        userViewModel.email = res.email;
        userViewModel.password = res.password;

        return userViewModel;
    }
}

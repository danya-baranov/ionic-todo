import { LoginViewModel } from './../../view-models/login.view-model';
import { UserViewModel } from './../../../../client/src/app/models/user.view-model';
import { UsersService } from './../users.service';
import { User } from '../../enteties/user.model';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    expireTime: number;
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {
        this.expireTime = 3600;
     }

    private async validate(userData: User): Promise<UserViewModel> {
        return await this.usersService.findByEmail(userData.email) as UserViewModel;
    }

    public async getUserById(id: string): Promise<UserViewModel> {
        return await this.usersService.findById(id) as UserViewModel;
    }

    public async login(user: User): Promise<LoginViewModel> {
        return this.validate(user).then(userData => {
            user.password = crypto.createHmac('sha256', user.password).digest('hex');
            if (!userData) {
                return { status: 401 };
            }
            if (userData.password !== user.password) {
                return { status: 401 };
            }
            const payload = `${userData.id}`;
            const accessToken = this.jwtService.sign(payload);

            return {
                expires_in: this.expireTime,
                access_token: accessToken,
                user_id: userData.id,
                status: 200,
            };
        });
    }

    async validateUser(useremail: string, pass: string): Promise<UserViewModel> {
        const user = await this.usersService.findByEmail(useremail);
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    public async register(user: User): Promise<UserViewModel> {
        user.password = crypto.createHmac('sha256', user.password).digest('hex');
        return this.usersService.create(user);
    }
}

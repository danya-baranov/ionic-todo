import { LoginViewModel } from './../view-models/login.view-model';
import { UserViewModel } from './../../../client/src/app/models/user.view-model';
import { User } from '../enteties/user.model';
import { AuthService } from './auth/auth.service';
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() user: User): Promise<LoginViewModel> {
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() user: User): Promise<UserViewModel> {
        return this.authService.register(user);
    }

    @Get('protected')
    @UseGuards(AuthGuard('jwt'))
    protectedResource() {
        return 'JWT is working!';
    }
}

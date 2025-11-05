import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import type { AccessToken, CreateUserDto } from '../dtos';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; password: string }): Promise<AccessToken> {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    return this.authService.signIn({ id: user.id, email: user.email });
  }

  @Post('register')
  async register(@Body() registerBody: CreateUserDto): Promise<AccessToken> {
    return this.authService.signUp(registerBody);
  }
}

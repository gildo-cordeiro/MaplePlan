
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { AccessToken, CreateUserDto } from '../dtos';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }

  async signIn(user: Pick<User, 'id' | 'email'>): Promise<AccessToken> {
    const payload = { email: user.email, id: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async signUp(user: CreateUserDto): Promise<AccessToken> {
    const existingUser = await this.usersService.findOneByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('email already exists');
    }
    const newUser = await this.usersService.createUser(user);
    return this.signIn(newUser);
  }
}

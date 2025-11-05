import { Injectable, ConflictException } from "@nestjs/common";
import { UserRepository } from "./users.repository";
import type { CreateUserDto } from "../dtos";
import type { Prisma, User } from "@prisma/client";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    private toPrismaCreate(data: CreateUserDto, passwordHash: string): Prisma.UserCreateInput {
        return {
            name: data.name.trim(),
            email: data.email.toLowerCase().trim(),
            passwordHash,
        };
    }

    async createUser(data: CreateUserDto): Promise<User> {
        const passwordHash = await bcrypt.hash(data.password, 10);

        const payload = this.toPrismaCreate(data, passwordHash);

        try {
            const user = await this.userRepository.create(payload);
            if (!user) {
                throw new Error('User creation failed');
            }
            return user;
        } catch (err: unknown) {
            const code = (err as { code?: unknown })?.code;
            if (typeof code === 'string' && code === 'P2002') {
                throw new ConflictException('Email already in use');
            }
            throw err;
        }
    }

    async findOneByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findByEmail(email.toLowerCase().trim());
         if (!user) {
            throw new Error('Invalid email or password');
        }
        return user
    }

    async findById(id: string): Promise<User> {
         const user = await this.userRepository.findById(id);
         if (!user) {
            throw new Error('Invalid email or password');
        }
        return user
    }
}
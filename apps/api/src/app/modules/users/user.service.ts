import { Injectable, ConflictException } from "@nestjs/common";
import { UserRepository } from "./users.repository";
import type { CreateUserDto, UserDto } from "@maple-plan/shared-types";
import type { Prisma } from "@prisma/client";
import * as argon2 from "argon2";

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

    async createUser(data: CreateUserDto): Promise<UserDto> {
        const passwordHash = await argon2.hash(data.password);

        const payload = this.toPrismaCreate(data, passwordHash);

        try {
            const user = await this.userRepository.create(payload);
            if (!user) {
                throw new Error('User creation failed');
            }
            const safeUser: UserDto = {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt.toISOString()
            };
            return safeUser;
        } catch (err: unknown) {
            const code = (err as { code?: unknown })?.code;
            if (typeof code === 'string' && code === 'P2002') {
                throw new ConflictException('Email already in use');
            }
            throw err;
        }
    }
}
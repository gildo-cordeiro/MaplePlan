import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type { User, Prisma } from "@prisma/client";

@Injectable()
export class UserRepository {
    constructor(private readonly prismaService: PrismaService) {}

    create(data: Prisma.UserCreateInput): Promise<User> {
        return this.prismaService.user.create({ data });
    }

    findById(id: string): Promise<User | null> {
        return this.prismaService.user.findUnique({ where: { id } });
    }

    findByEmail(email: string): Promise<User | null> {
        return this.prismaService.user.findUnique({ where: { email } });
    }

    findAll(): Promise<User[]> {
        return this.prismaService.user.findMany();
    }

    update(id: string, data: Partial<User>): Promise<User> {
        return this.prismaService.user.update({ where: { id }, data });
    }

    delete(id: string): Promise<User> {
        return this.prismaService.user.delete({ where: { id } });
    }
}
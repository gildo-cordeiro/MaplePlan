import { Controller, Post, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import type { CreateUserDto } from "../dtos";
import { createUserSchema } from "../dtos";
import { ZodSchema } from "../../common/decorators/zod-schema.decorator";
import { Public } from "../../common/decorators/public.decorator";

@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @Public()
    @ZodSchema(createUserSchema)
    async createUser(@Body() data: CreateUserDto) {
        const user = await this.userService.createUser(data);
        return { user, verificationSent: true };
    }
}
import { Controller, Post, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import type { CreateUserDto, UserDto } from "@maple-plan/shared-types";
import { createUserSchema } from "@maple-plan/shared-types";
import { ZodSchema } from "../../common/decorators/zod-schema.decorator";

@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @ZodSchema(createUserSchema)
    async createUser(@Body() data: CreateUserDto): Promise<UserDto> {
        const user = await this.userService.createUser(data);
        return user;
    }
}
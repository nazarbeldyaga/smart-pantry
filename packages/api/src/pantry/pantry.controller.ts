import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PantryService } from './pantry.service';
import { CreatePantryItemDto } from './dto/create-pantry-item.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request as ExpressRequest } from 'express';

interface JwtUserPayload {
  sub: string;
  email: string;
}

interface RequestWithUser extends ExpressRequest {
  user: JwtUserPayload;
}

@Controller('pantry')
export class PantryController {
  constructor(private readonly pantryService: PantryService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getMyPantry(@Request() req: RequestWithUser) {
    const userId = req.user.sub;
    return this.pantryService.getItemsByUserId(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async addItem(@Request() req: RequestWithUser, @Body() dto: CreatePantryItemDto) {
    const userId = req.user.sub;
    return this.pantryService.addItem(userId, dto);
  }
}

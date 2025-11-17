import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PantryService } from './pantry.service';
import { CreatePantryItemDto } from './dto/create-pantry-item.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request as ExpressRequest } from 'express';
import { DeletePantryItemsDto } from './dto/delete-pantry-items.dto';

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

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteItems(@Request() req: RequestWithUser, @Body() dto: DeletePantryItemsDto) {
    const userId = req.user.sub;

    await this.pantryService.deleteItems(userId, dto.ids);
  }
}

import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ShoppingListService } from './shopping-list.service';
import { CreateShoppingItemDto } from './dto/create-shopping-item.dto';
import { CompleteShoppingDto } from './dto/complete-shopping.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request as ExpressRequest } from 'express';

interface JwtUserPayload {
  sub: string;
  email: string;
}

interface RequestWithUser extends ExpressRequest {
  user: JwtUserPayload;
}

@UseGuards(AuthGuard('jwt'))
@Controller('shopping-list')
export class ShoppingListController {
  constructor(private readonly shoppingListService: ShoppingListService) {}

  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.shoppingListService.findAll(req.user.sub);
  }

  @Post()
  create(@Request() req: RequestWithUser, @Body() dto: CreateShoppingItemDto) {
    return this.shoppingListService.create(req.user.sub, dto);
  }

  @Delete(':id')
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.shoppingListService.delete(req.user.sub, id);
  }

  @Post('complete')
  completeShopping(@Request() req: RequestWithUser, @Body() dto: CompleteShoppingDto) {
    return this.shoppingListService.completeShopping(req.user.sub, dto);
  }
}

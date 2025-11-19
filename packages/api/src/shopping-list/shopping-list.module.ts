import { Module } from '@nestjs/common';
import { ShoppingListService } from './shopping-list.service';
import { ShoppingListController } from './shopping-list.controller';
import { ShoppingListRepository } from './shopping-list.repository';
import { PantryModule } from '../pantry/pantry.module';

@Module({
  imports: [PantryModule],
  controllers: [ShoppingListController],
  providers: [ShoppingListService, ShoppingListRepository],
})
export class ShoppingListModule {}

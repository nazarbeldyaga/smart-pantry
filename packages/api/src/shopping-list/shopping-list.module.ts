import { Module } from '@nestjs/common';
import { ShoppingListService } from './shopping-list.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingListController } from './shopping-list.controller';
import { PantryModule } from '../pantry/pantry.module';
import { ShoppingList } from './shopping-list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingList]), PantryModule],
  controllers: [ShoppingListController],
  providers: [ShoppingListService],
})
export class ShoppingListModule {}

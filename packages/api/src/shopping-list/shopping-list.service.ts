import { Injectable, Logger } from '@nestjs/common';
import { CreateShoppingItemDto } from './dto/create-shopping-item.dto';
import { PantryService } from '../pantry/pantry.service';
import { ShoppingListRepository } from './shopping-list.repository';
import { ShoppingList } from './shopping-list.entity';
import { CompleteShoppingDto } from './dto/complete-shopping.dto';

@Injectable()
export class ShoppingListService {
  constructor(
    private readonly repository: ShoppingListRepository,
    private readonly pantryService: PantryService
  ) {}
  private readonly logger = new Logger(ShoppingListService.name);

  async findAll(userId: string) {
    return this.repository.findAll(userId);
  }

  async create(userId: string, dto: CreateShoppingItemDto) {
    const newItem = new ShoppingList();
    newItem.userId = userId;
    newItem.name = dto.name;
    newItem.quantity = dto.quantity;
    newItem.unit = dto.unit;
    newItem.category = dto.category || 'Інше';
    newItem.productId = null;

    return this.repository.create(newItem);
  }

  async delete(userId: string, id: string) {
    return this.repository.delete(userId, id);
  }

  async completeShopping(userId: string, dto: CompleteShoppingDto) {
    const { ids } = dto;
    let movedCount = 0;

    for (const id of ids) {
      const item = await this.repository.findById(userId, id);

      if (item) {
        await this.pantryService.addItem(userId, {
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          category: item.category,
        });

        await this.repository.delete(userId, id);
        movedCount++;
      }
    }

    return { count: movedCount };
  }
}

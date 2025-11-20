import { Injectable } from '@nestjs/common';
import { CreateShoppingItemDto } from './dto/create-shopping-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PantryService } from '../pantry/pantry.service';
import { ShoppingList } from './shopping-list.entity';
import { CompleteShoppingDto } from './dto/complete-shopping.dto';
import type { UnitType } from '../shared/domain-types';

@Injectable()
export class ShoppingListService {
  constructor(
    @InjectRepository(ShoppingList)
    private readonly shoppingListRepo: Repository<ShoppingList>,
    private readonly pantryService: PantryService
  ) {}

  async findAll(userId: string): Promise<ShoppingList[]> {
    return this.shoppingListRepo.find({ where: { userId } });
  }

  async create(userId: string, dto: CreateShoppingItemDto): Promise<ShoppingList> {
    const newItem = this.shoppingListRepo.create({
      userId,
      name: dto.name,
      quantity: dto.quantity,
      unit: dto.unit,
      category: dto.category || 'Інше',
      productId: null,
    });

    return this.shoppingListRepo.save(newItem);
  }

  async delete(userId: string, id: string): Promise<void> {
    await this.shoppingListRepo.delete({ id, userId });
  }

  async completeShopping(userId: string, dto: CompleteShoppingDto) {
    const { ids } = dto;
    let movedCount = 0;
    const itemsToMove = await this.shoppingListRepo.find({
      where: {
        userId,
        id: In(ids),
      },
    });

    for (const item of itemsToMove) {
      await this.pantryService.addItem(userId, {
        name: item.name,
        quantity: item.quantity,
        unit: item.unit as UnitType,
        category: item.category,
      });

      await this.shoppingListRepo.delete(item.id);
      movedCount++;
    }

    return { count: movedCount };
  }
}

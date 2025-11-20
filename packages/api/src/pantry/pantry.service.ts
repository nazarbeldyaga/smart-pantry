import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PantryRepository } from './pantry.repository';
import { CreatePantryItemDto } from './dto/create-pantry-item.dto';
import { PantryItem } from './pantry.entity';
import { ProductService } from '../product/product.service';
import { EditPantryItemDto } from './dto/edit-pantry-item.dto';

@Injectable()
export class PantryService {
  constructor(
    private readonly pantryRepo: PantryRepository,
    private readonly productService: ProductService
  ) {}

  async getItemsByUserId(userId: string): Promise<PantryItem[]> {
    return this.pantryRepo.findByUserId(userId);
  }

  async addItem(userId: string, dto: CreatePantryItemDto): Promise<PantryItem> {
    const masterProduct = await this.productService.findByName(dto.name);

    const newItem = new PantryItem();
    newItem.userId = userId;
    newItem.quantity = dto.quantity;
    newItem.unit = dto.unit;
    newItem.expiryDate = dto.expiryDate;

    if (masterProduct) {
      newItem.productId = masterProduct.id;
      newItem.name = masterProduct.name;
      newItem.category = masterProduct.category;
    } else {
      newItem.productId = null;
      newItem.name = dto.name;
      newItem.category = dto.category || 'Інше';
    }

    return this.pantryRepo.create(newItem);
  }

  async deleteItems(userId: string, itemIds: string[]): Promise<void> {
    return this.pantryRepo.deleteByIds(userId, itemIds);
  }

  async updateItem(userId: string, itemId: string, dto: EditPantryItemDto): Promise<PantryItem> {
    const currentItem = await this.pantryRepo.findById(itemId);

    if (!currentItem) {
      throw new NotFoundException('Продукт не знайдено');
    }
    if (currentItem.userId !== userId) {
      throw new ForbiddenException('Ви не маєте права редагувати цей продукт');
    }

    const updates: Partial<PantryItem> = {};

    if (dto.quantity !== undefined) updates.quantity = dto.quantity;
    if (dto.unit !== undefined) updates.unit = dto.unit;
    if (dto.expiryDate !== undefined) updates.expiryDate = dto.expiryDate;
    if (dto.category && currentItem.productId === null) {
      updates.category = dto.category;
    }
    return this.pantryRepo.update(itemId, updates);
  }
}

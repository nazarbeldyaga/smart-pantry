import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreatePantryItemDto } from './dto/create-pantry-item.dto';
import { PantryItem } from './pantry.entity';
import { ProductService } from '../product/product.service';
import { EditPantryItemDto } from './dto/edit-pantry-item.dto';

@Injectable()
export class PantryService {
  constructor(
    @InjectRepository(PantryItem)
    private readonly pantryRepo: Repository<PantryItem>,
    private readonly productService: ProductService
  ) {}

  async getItemsByUserId(userId: string): Promise<PantryItem[]> {
    return this.pantryRepo.find({ where: { userId } });
  }

  async addItem(userId: string, dto: CreatePantryItemDto): Promise<PantryItem> {
    const masterProduct = await this.productService.findByName(dto.name);

    const newItem = this.pantryRepo.create({
      userId,
      name: dto.name,
      quantity: dto.quantity,
      unit: dto.unit,
      expiryDate: dto.expiryDate,
      productId: masterProduct ? masterProduct.id : null,
      category: masterProduct ? masterProduct.category : dto.category || 'Інше',
    });

    return this.pantryRepo.save(newItem);
  }

  async deleteItems(userId: string, itemIds: string[]): Promise<void> {
    await this.pantryRepo.delete({
      userId,
      id: In(itemIds),
    });
  }

  async updateItem(userId: string, itemId: string, dto: EditPantryItemDto): Promise<PantryItem> {
    const currentItem = await this.pantryRepo.findOne({ where: { id: itemId } });

    if (!currentItem) {
      throw new NotFoundException('Продукт не знайдено');
    }
    if (currentItem.userId !== userId) {
      throw new ForbiddenException('Ви не маєте права редагувати цей продукт');
    }

    if (dto.quantity !== undefined) currentItem.quantity = dto.quantity;
    if (dto.unit !== undefined) currentItem.unit = dto.unit;
    if (dto.expiryDate !== undefined) currentItem.expiryDate = dto.expiryDate;

    if (dto.category && currentItem.productId === null) {
      currentItem.category = dto.category;
    }

    return this.pantryRepo.save(currentItem);
  }
}

import { Injectable } from '@nestjs/common';
import { PantryRepository } from './pantry.repository';
import { CreatePantryItemDto } from './dto/create-pantry-item.dto';
import { PantryItem } from './pantry.entity';
import { ProductService } from '../product/product.service';

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
}

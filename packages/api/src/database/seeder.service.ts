import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { CreateProductDto } from '../product/dto/create-product.dto';

const BASE_PRODUCTS = [
  { name: 'Молоко', category: 'Молочне', unit: 'л' },
  { name: 'Картопля', category: 'Овочі', unit: 'кг' },
  { name: 'Борошно', category: 'Випічка', unit: 'кг' },
  { name: 'Сіль', category: 'Спеції', unit: 'г' },
  { name: 'Цукор', category: 'Спеції', unit: 'кг' },
  { name: 'Сметана', category: 'Молочне', unit: 'г' },
  { name: 'Хліб', category: 'Випічка', unit: 'шт' },
];

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(private readonly productService: ProductService) {}

  // Цей метод запуститься автоматично при старті сервера
  async onApplicationBootstrap() {
    console.log('🌱 Checking DB seeds...');
    for (const productData of BASE_PRODUCTS) {
      const existing = await this.productService.findByName(productData.name);
      if (!existing) {
        console.log(`Creating: ${productData.name}`);
        await this.productService.create(productData as CreateProductDto);
      }
    }
    console.log('✅ Seeding complete.');
  }
}

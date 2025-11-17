import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepository) {}

  async findByName(name: string): Promise<Product | undefined> {
    return this.productRepo.findByName(name);
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const newProduct = new Product();
    newProduct.name = dto.name;
    newProduct.category = dto.category || 'custom'; // "custom" як категорія за замовчуванням

    return this.productRepo.create(newProduct);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepo.findAll();
  }
}

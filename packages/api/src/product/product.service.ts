import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>
  ) {}

  async findByName(name: string): Promise<Product | undefined> {
    const product = await this.productRepo.findOne({ where: { name } });
    return product || undefined;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const newProduct = this.productRepo.create({
      name: dto.name,
      category: dto.category || 'custom',
    });
    return this.productRepo.save(newProduct);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepo.find();
  }
}

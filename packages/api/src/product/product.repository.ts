import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Product } from './product.entity';

interface ProductDbData {
  products: Product[];
}

@Injectable()
export class ProductRepository {
  private dbPath = path.join(process.cwd(), 'db.products.json');

  private async readDB(): Promise<ProductDbData> {
    try {
      const data = await fs.readFile(this.dbPath, 'utf-8');
      const parsed = JSON.parse(data);
      return {
        products: Array.isArray(parsed.products) ? parsed.products : [],
      };
    } catch (_) {
      return { products: [] };
    }
  }

  private async writeDB(data: ProductDbData): Promise<void> {
    await fs.writeFile(this.dbPath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async findAll(): Promise<Product[]> {
    const db = await this.readDB();
    return db.products;
  }

  async findByName(name: string): Promise<Product | undefined> {
    const db = await this.readDB();
    return db.products.find((p) => p.name.toLowerCase() === name.toLowerCase());
  }

  async create(product: Product): Promise<Product> {
    const db = await this.readDB();
    product.id = `prod${Date.now()}`;
    db.products.push(product);
    await this.writeDB(db);
    return product;
  }
}

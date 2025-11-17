import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { PantryItem } from './pantry.entity';

interface PantryDbData {
  pantryItems: PantryItem[];
}

@Injectable()
export class PantryRepository {
  private dbPath = path.join(process.cwd(), 'db.user_product.json');

  private async readDB(): Promise<PantryDbData> {
    try {
      const data = await fs.readFile(this.dbPath, 'utf-8');
      const parsed = JSON.parse(data);
      return {
        pantryItems: Array.isArray(parsed.pantryItems) ? parsed.pantryItems : [],
      };
    } catch (error) {
      return { pantryItems: [] };
    }
  }

  private async writeDB(data: PantryDbData): Promise<void> {
    await fs.writeFile(this.dbPath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async findByUserId(userId: string): Promise<PantryItem[]> {
    const db = await this.readDB();
    return db.pantryItems.filter((item) => item.userId === userId);
  }

  async create(item: PantryItem): Promise<PantryItem> {
    const db = await this.readDB();
    item.id = `p${Date.now()}`;
    db.pantryItems.push(item);
    await this.writeDB(db);
    return item;
  }
}

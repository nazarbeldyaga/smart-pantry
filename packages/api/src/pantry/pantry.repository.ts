import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { PantryItem } from './pantry.entity';

interface PantryDbData {
  pantryItems: PantryItem[];
}

@Injectable()
export class PantryRepository {
  private dbPath = path.join(process.cwd(), 'db.pantry.json');

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

  async deleteByIds(userId: string, itemIds: string[]): Promise<void> {
    const db = await this.readDB();

    db.pantryItems = db.pantryItems.filter((item) => {
      if (item.userId !== userId) {
        return true;
      }

      if (!itemIds.includes(item.id)) {
        return true;
      }

      return false;
    });

    await this.writeDB(db);
  }

  async findById(id: string): Promise<PantryItem | undefined> {
    const db = await this.readDB();
    return db.pantryItems.find((item) => item.id === id);
  }

  async update(itemId: string, updates: Partial<PantryItem>): Promise<PantryItem> {
    const db = await this.readDB();
    const index = db.pantryItems.findIndex((item) => item.id === itemId);

    if (index === -1) {
      throw new Error('Item not found during update write');
    }

    const originalItem = db.pantryItems[index];

    const updatedItem = {
      ...originalItem,
      ...updates,
    };
    db.pantryItems[index] = updatedItem;
    await this.writeDB(db);

    return updatedItem;
  }
}

import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ShoppingList } from './shopping-list.entity';

interface ShoppingListDbData {
  listItems: ShoppingList[];
}

@Injectable()
export class ShoppingListRepository implements OnModuleInit {
  private dbPath = path.join(process.cwd(), 'db.shopping-list.json');

  async onModuleInit() {
    try {
      await fs.access(this.dbPath);
    } catch {
      await fs.writeFile(this.dbPath, JSON.stringify({ items: [] }, null, 2));
    }
  }

  private async readDB(): Promise<ShoppingListDbData> {
    const data = await fs.readFile(this.dbPath, 'utf-8');
    return JSON.parse(data);
  }

  private async writeDB(data: ShoppingListDbData): Promise<void> {
    await fs.writeFile(this.dbPath, JSON.stringify(data, null, 2));
  }

  async findAll(userId: string): Promise<ShoppingList[]> {
    const db = await this.readDB();
    return db.listItems.filter((item) => item.userId === userId);
  }

  async findById(userId: string, id: string): Promise<ShoppingList | undefined> {
    const db = await this.readDB();
    return db.listItems.find((item) => item.id === id && item.userId === userId);
  }

  async create(item: ShoppingList): Promise<ShoppingList> {
    const db = await this.readDB();

    item.id = `shop${Date.now()}`;

    db.listItems.push(item);
    await this.writeDB(db);
    return item;
  }

  async delete(userId: string, id: string): Promise<void> {
    const db = await this.readDB();
    db.listItems = db.listItems.filter((item) => !(item.id === id && item.userId === userId));
    await this.writeDB(db);
  }
}

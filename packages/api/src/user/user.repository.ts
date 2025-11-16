import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
  private dbPath = path.join(__dirname, '..', 'db.json');

  private async readDB(): Promise<{ users: User[] }> {
    try {
      const data = await fs.readFile(this.dbPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return { users: [] };
    }
  }

  private async writeDB(data: { users: User[] }): Promise<void> {
    await fs.writeFile(this.dbPath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const db = await this.readDB();
    return db.users.find((user) => user.email === email);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const db = await this.readDB();
    return db.users.find((user) => user.username === username);
  }

  async create(user: User): Promise<User> {
    const db = await this.readDB();
    user.id = `u${Date.now()}`;
    db.users.push(user);
    await this.writeDB(db);
    return user;
  }
}

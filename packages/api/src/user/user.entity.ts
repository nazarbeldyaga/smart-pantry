import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PantryItem } from '../pantry/pantry.entity';
import { ShoppingList } from '../shopping-list/shopping-list.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @OneToMany(() => PantryItem, (pantryItem) => pantryItem.user)
  pantryItems: PantryItem[];

  @OneToMany(() => ShoppingList, (shoppingList) => shoppingList.user)
  shoppingLists: ShoppingList[];
}

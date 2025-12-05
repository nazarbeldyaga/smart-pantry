import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PantryItem } from '../pantry/pantry.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @OneToMany(() => PantryItem, (pantryItem) => pantryItem.product)
  pantryItems: PantryItem[];
}

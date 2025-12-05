import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';
import type { UnitType } from '../shared/domain-types';

@Entity()
export class ShoppingList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column('float')
  quantity: number;

  @Column({ type: 'varchar' })
  unit: UnitType;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.shoppingLists, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid', nullable: true })
  productId: string | null;

  @ManyToOne(() => Product, { nullable: true })
  @JoinColumn({ name: 'productId' })
  product: Product | null;
}

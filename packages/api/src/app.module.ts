import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PantryModule } from './pantry/pantry.module';
import { ProductModule } from './product/product.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user/user.entity';
import { PantryItem } from './pantry/pantry.entity';
import { Product } from './product/product.entity';
import { ShoppingList } from './shopping-list/shopping-list.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // eslint-disable-next-line
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [User, PantryItem, Product, ShoppingList],
        synchronize: true,
        ssl: config.get<boolean>('DB_SSL') ? { rejectUnauthorized: false } : false,
      }),
    }),
    AuthModule,
    UserModule,
    PantryModule,
    ProductModule,
    ShoppingListModule,
  ],
})
export class AppModule {}

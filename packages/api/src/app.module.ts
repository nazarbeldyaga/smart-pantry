import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PantryModule } from './pantry/pantry.module';
import { ProductModule } from './product/product.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PantryModule,
    ProductModule,
    ShoppingListModule,
  ],
})
export class AppModule {}

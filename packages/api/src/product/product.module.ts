import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AuthModule } from '../auth/auth.module';
import { Product } from './product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]), // <-- Підключаємо Entity
    AuthModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}

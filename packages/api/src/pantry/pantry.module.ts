import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PantryController } from './pantry.controller';
import { PantryService } from './pantry.service';
import { PantryItem } from './pantry.entity';
import { ProductModule } from '../product/product.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PantryItem]), // <-- Підключаємо Entity
    AuthModule,
    ProductModule,
  ],
  controllers: [PantryController],
  providers: [PantryService],
  exports: [PantryService],
})
export class PantryModule {}

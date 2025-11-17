import { Module } from '@nestjs/common';
import { PantryController } from './pantry.controller';
import { PantryService } from './pantry.service';
import { PantryRepository } from './pantry.repository';
import { ProductModule } from '../product/product.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, ProductModule],
  controllers: [PantryController],
  providers: [PantryService, PantryRepository],
})
export class PantryModule {}

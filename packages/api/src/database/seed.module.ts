import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [ProductModule],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeedModule {}

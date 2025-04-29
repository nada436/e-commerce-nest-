import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { BrandModel } from 'src/database/models';
import { BrandRepository } from 'src/repository/Brand.repository.service';

@Module({
  imports:[BrandModel],
  providers: [BrandService,BrandRepository],
  controllers: [BrandController]
})
export class BrandModule {}

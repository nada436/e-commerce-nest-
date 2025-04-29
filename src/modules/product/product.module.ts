import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductModel } from 'src/database/models/productModel';

@Module({
  imports:[ProductModel],
  providers: [ProductService],
  controllers: [ProductController]
})
export class ProductModule {}

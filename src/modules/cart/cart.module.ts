import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { cartRepository } from 'src/repository/cart.repository.service';
import { cartModel } from 'src/database/models/Cart.Model';

@Module({
  imports:[cartModel],
  providers: [CartService,cartRepository],
  controllers: [CartController]
})
export class CartModule {}

import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { orderRepository } from 'src/repository/order.repository.service ';
import { cartRepository } from 'src/repository/cart.repository.service';
import { OrderModel } from 'src/database/models/Order.Model';
import { cartModel } from 'src/database/models/Cart.Model';
import { copounRepository } from 'src/repository/copoun.repository.service ';
import { couponModel } from 'src/database/models/Copoun.Model';
import { paymentService } from './service/payment';
import { OrderGraphqlResolver } from 'src/graphql/resolver/order.resolver';

@Module({
  imports:[OrderModel,cartModel,couponModel],
  providers: [OrderService,orderRepository,cartRepository,copounRepository,paymentService,OrderGraphqlResolver],
  controllers: [OrderController],
  exports:[OrderService,orderRepository,cartRepository,copounRepository,paymentService]
})
export class OrderModule {}

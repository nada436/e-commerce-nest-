
import { Resolver, Query } from '@nestjs/graphql';
import { OrderService } from './../../modules/order/order.service';
import { OrdersType } from '../types/types';
import { Auth } from 'src/common/decorator/auth.decorator';
import { UserRoles } from 'src/common/types/types';

@Resolver()
export class OrderGraphqlResolver {
  constructor(private readonly OrderService:OrderService){}
  @Auth([UserRoles.admin,UserRoles.user])
  @Query(() => [OrdersType])
  async get_all_orders() {
    return this.OrderService.get_orders()
  }

}

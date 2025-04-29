import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { Auth } from 'src/common/decorator/auth.decorator';
import { UserRoles } from 'src/common/types/types';
import { CreatecartDto} from 'src/common/dto/cart.dto';
import { GetUser } from 'src/common/decorator/user.decorator';
import { UserDocument } from 'src/database/models';

@Controller('cart')
export class CartController {
constructor(private readonly CartService:CartService){}
    @Post('/add')
    @Auth([UserRoles.admin,UserRoles.user])
    add_to_cart(
    @Body() data: CreatecartDto,
    @GetUser() user: UserDocument) {
  return this.CartService.add_to_cart(data, user);
}

   @Delete('/delete/:product_id')
   @Auth([UserRoles.admin,UserRoles.user])
   remove_from_cart(
   @Param('product_id') product_id:String,
   @GetUser() user: UserDocument) {
  return this.CartService.remove_from_cart(product_id, user);
}

@Patch('/update_product_quantity')
    @Auth([UserRoles.admin,UserRoles.user])
    update_cart(
    @Body() data: CreatecartDto,
    @GetUser() user: UserDocument) {
  return this.CartService.update_product_quantity(data, user);
}

}

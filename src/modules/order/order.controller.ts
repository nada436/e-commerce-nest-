import { Body, Controller, Param, Patch, Post, RawBody } from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from 'src/common/decorator/auth.decorator';
import { UserRoles } from 'src/common/types/types';
import { CreateorderDto } from 'src/common/dto/order.dto';
import { GetUser } from 'src/common/decorator/user.decorator';
import { UserDocument } from 'src/database/models';

@Controller('order')
export class OrderController {
    constructor(private readonly OrderService:OrderService){}
    @Post('/new')
    @Auth([UserRoles.admin,UserRoles.user])
    make_order(@Body() data:CreateorderDto,@GetUser() user:UserDocument){
      return this.OrderService.make_order(data,user)
    }

    @Post('/create_payment')
    @Auth([UserRoles.admin,UserRoles.user])
    create_payment(@Body('order_id') order_id:String ,@GetUser() user:UserDocument){
      return this.OrderService.create_payment_with_scripe(order_id,user)
    }
    @Post('web_hook')
    web_hook(@Body() data:any){
      return this.OrderService.web_hook(data)
    }


    @Patch('/cancel/:order_id')
    @Auth([UserRoles.admin,UserRoles.user])
    cancel_order(@Param('order_id') order_id:String,@GetUser() user:UserDocument){
      return this.OrderService.cancel_order(order_id,user)
    }
}

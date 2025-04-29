import { BadRequestException, Injectable } from '@nestjs/common';
import { orderRepository } from './../../repository/order.repository.service ';
import { cartRepository } from './../../repository/cart.repository.service';
import { cart } from 'src/database/models/Cart.Model';
import { OrderStatusTypes, PaymentMethodTypes } from 'src/common/types/types';
import { copounRepository } from './../../repository/copoun.repository.service ';
import { paymentService } from './service/payment';
import { populate } from 'dotenv';
import { productRepository } from 'src/repository/product.repository.service';
import { Product } from 'src/database/models/productModel';


@Injectable()
export class OrderService {
    constructor(private readonly orderRepository:orderRepository,private readonly cartRepository:cartRepository,private readonly copounRepository:copounRepository
     , private readonly paymentService:paymentService,private readonly productRepository:productRepository
    ){}
/////////////////////////////create order////////////////////////////////////////////////////////////////////
make_order = async (data,user) => {
    const cart = await this.cartRepository.findOne({ userId: user._id });
  
    if (!cart || cart.products.length === 0) {
      throw new BadRequestException('Cart is empty');
    }
  
    let status = OrderStatusTypes.pending;
    if (data.paymentMethod === PaymentMethodTypes.cash) {
      status = OrderStatusTypes.placed;
    }
  
    let total_price = cart.subtotal;
   let copoun_id={}
    if (data?.copoun_code) {
      const copoun = await this.copounRepository.findOne({ code: data.copoun_code });
  
      if (
        !copoun ||
        (copoun.to_date as any) < new Date() ||
        (copoun.from_date as any) > new Date()
      ) {
        throw new BadRequestException('Invalid or expired coupon');
      } if(copoun.used_by.includes(user._id)){throw new BadRequestException('you can use each copoun only one time, try another one')}
      copoun.used_by.push(user._id)
      await copoun.save()
      copoun_id["copoun_id"]=copoun._id
      total_price = Number(total_price) - (Number(total_price) * Number(copoun.amount) / 100);
}

const order = await this.orderRepository.create({
  userId: user._id,
  cartId: cart._id,
  paymentMethod: data.paymentMethod,
  phone: data.phone,
  address: data.address,
  status,
  total_price,
  ...copoun_id,

});

if(data.paymentMethod === PaymentMethodTypes.cash){await this.cartRepository.update({ _id: cart._id }, {
  products: [],
  subtotal: 0,
});order.orderChanges["paidAt"]=new Date()
;}

return order
  }
/////////////////////////////payment with scripe////////////////////////////////////////////////////////////////////
create_payment_with_scripe = async (order_id, user) => {
  const order = await this.orderRepository.findOne(
    { userId: user._id, _id: order_id, status: OrderStatusTypes.pending },
    [
      {
        path: 'cartId',
        select: 'products',
        populate: {
          path: 'products.productId',
        },
      },
      {
        path: 'copoun_id',
      },
    ]
  );

  if (!order) {
    throw new BadRequestException('Invalid order or You are not authorized');
  }
  type discounts = {
    coupon: string;
  };
  let discounts:discounts[] = [];
  if (order.copoun_id && order.copoun_id["amount"]) {
    const couponId = await this.paymentService.createCoupon({
      amount: order.copoun_id["amount"],
      isPercentage: true,
    });
    discounts = [{ coupon: couponId }];
  }


  const session = await this.paymentService.create_checkout_session({
    customer_email: user.email,
    metadata: { orderid: order._id.toString() },
    line_items: order.cartId["products"].map((product) => ({
      price_data: {
        currency: "egp",
        unit_amount: product.productId.subPrice * 100,
        product_data: {
          name: product.productId.name,
          description: product.productId.description,
          images: [product.productId.mainImage.secure_url], 
        },
      },
      quantity: product.quantity,
    })),
    discounts,
  });
  await this.cartRepository.update({ _id:order.cartId}, {
    products: [],
    subtotal: 0,
  });

  return session;
};
/////////////////////////////webhook////////////////////////////////////////////////////////////////////
 web_hook = async(data) => {

  const order=await this.orderRepository.update({_id:data.data.object.metadata.orderid},{payment_intent:data.data.object.payment_intent,orderChanges:{paidAt:new Date()},status:OrderStatusTypes.placed})
  return order
 }

 
/////////////////////////////cancel order////////////////////////////////////////////////////////////////////
cancel_order = async (order_id,user) => {
   const order= await this.orderRepository.findOne({userId:user._id,_id:order_id})
   if(!order){throw new BadRequestException('Invalid order or You are not authorized to cancel this order ')}
   if(order.status==OrderStatusTypes.cancelled) {throw new BadRequestException('order already  cancelled ')}
   await this.orderRepository.update({_id:order_id},{status:OrderStatusTypes.cancelled,orderChanges:{cancelledAt: new Date(),
    cancelledBy: user._id}})  
    //update quantity
  const cart = await this.cartRepository.findOne({ userId: user._id });
  cart?.products.forEach(async(cart_product) => {
  const Product=await this.productRepository.findOne({_id:cart_product.productId})
  if(Product?.quantity){Product.quantity+=cart_product.quantity
    await Product.save()
  }})
    if(order.paymentMethod==PaymentMethodTypes.credit_card){
      await this.paymentService.createRefund(order.payment_intent, "requested_by_customer")
      await this.orderRepository.update({_id:order_id},{orderChanges:{refundedAt:new Date(),refundedBy:user._id}})  
    }
return {msg:"Order cancelled successfully"}
  }
/////////////////////////////all orders////////////////////////////////////////////////////////////////////
get_orders = async() => {
  const orders=await this.orderRepository.findAll({})
  return orders
 }}

 
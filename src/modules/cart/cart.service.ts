import { BadRequestException, Injectable } from '@nestjs/common';
import { cartRepository } from './../../repository/cart.repository.service';
import { productRepository } from './../../repository/product.repository.service';
import { categoyRepository } from 'src/repository/Category.repository.service ';
import { UpdateSubCategoryDto } from 'src/common/dto/subcategory.dto';

@Injectable()
export class CartService {
constructor(private readonly cartRepository:cartRepository,private readonly productRepository:productRepository){}
///////////////////////////////////add to cart//////////////////////////////////////////////////////////////////////
add_to_cart = async (data,user) => {
    const product = await this.productRepository.findOne({ _id: data.product_id });

    if (!product) {
        throw new BadRequestException("This product doesn't exist");
    }
    if(product.quantity<data.quantity){
        if(product.quantity==0)   throw new BadRequestException("This product out of stock")
        throw new BadRequestException(`only ${product.quantity} items available from this product` )
    }
    let cart=await this.cartRepository.findOne({userId:user._id})
    if(!cart){
         cart = await this.cartRepository.create({
            userId: user._id,
            products: [{
                productId: data.product_id,
                quantity: data.quantity,
                total_price: product.subPrice * data.quantity, 
            }]
        });
    }
    else{
       const isproduct_exist= cart.products.find((product) => {return product.productId.toString()==data.product_id})
       if(isproduct_exist)throw new BadRequestException(`${product.name} already in your cart` )
         cart.products.push({productId: data.product_id,
            quantity: data.quantity,
            total_price: product.subPrice * data.quantity})
            await cart.save()
    }        
    return {msg:`${product.name} added successfully to cart`,cart }}
////////////////////////////////////////////////remove from cart////////////////////////////////////////////////////////
remove_from_cart = async (product_id,user) => {
    const product = await this.productRepository.findOne({ _id: product_id });

    if (!product) {
        throw new BadRequestException("invalid product");
    }
    let cart = await this.cartRepository.findOne({
        userId: user._id,"products.productId": { $in: [product_id] },} as any);
    if(!cart){
        throw new BadRequestException("This product not in your cart")};
   cart.products=cart.products.filter((product) => { return product.productId.toString()!==product_id})
   await cart.save()
          
    return {msg:`${product.name} removed successfully`,cart }}


////////////////////////////////////////////////update product quantity in cart////////////////////////////////////////////////////////
update_product_quantity = async (data,user) => {
    const product = await this.productRepository.findOne({ _id: data.product_id });
    if (!product) {
        throw new BadRequestException("invalid product");
    }
    let cart = await this.cartRepository.findOne({
        userId: user._id,"products.productId": { $in: [data.product_id] },} as any);
    if(!cart){
        throw new BadRequestException("This product not in your cart")};

   let Updated_product=cart.products.find((product) => { return product.productId.toString()==data.product_id})
   if(Updated_product){
   Updated_product.quantity=data.quantity
   Updated_product.total_price= product.subPrice * data.quantity}
   await cart.save()

          
    return {msg:`${product.name} quantity updated successfully`,cart }}
}
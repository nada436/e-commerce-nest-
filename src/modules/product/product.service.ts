import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { productRepository } from './../../repository/product.repository.service';
import { categoyRepository } from 'src/repository/Category.repository.service ';
import { SubCategory } from 'src/database/models';
import { SubCategoryRepository } from 'src/repository/SubCategory.repository.service';
import { BrandRepository } from 'src/repository/Brand.repository.service';
import { FileUploadService } from 'src/common/services/cloudinary/uploud_file.service';
import { FilterQuery } from 'mongoose';
import { ProductDocument } from 'src/database/models/productModel';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ProductService {
   constructor(private readonly productRepository:productRepository,private readonly categoyRepository:categoyRepository,
      private readonly SubCategoryRepository:SubCategoryRepository, private readonly BrandRepository:BrandRepository,
      private readonly FileUploadService:FileUploadService,@Inject(CACHE_MANAGER) private cacheManager: Cache){}
   //////////////////////////add product//////////////////////////////////////
   add_product=async(data,images) => {
      const category=await this.categoyRepository.findOne({name:data.category_name})
      const subcategory=await this.SubCategoryRepository.findOne({name:data.subCategory_name})
      const brand=await this.BrandRepository.findOne({name:data.brand_name})
      const existingproduct = await this.productRepository.findOne({ name: data.name ,brand:data.brand});
    if ( existingproduct) {
      throw new BadRequestException('This product name already exists');
    }
      if(!category){
         throw new BadRequestException("this category is not exist ,you can make new category then add items")
      }
      if(!subcategory){
         throw new BadRequestException("this subcategory is not exist ,you can make new subcategory then add items")
      }
      if(!brand){
         throw new BadRequestException("this brand is not exist ,you can make new brand then add items")
      }
      
      const product_no = Math.floor(Math.random() * 1000); // Random number from 0 to 999
      if(!images.mainImage){
         throw new BadRequestException("You must upload at least one product image.")
      }
      let Image= await this.FileUploadService.uploadFiles(images.mainImage, { folder: `e_commerce/categories/${category.category_no}/${subcategory.subcategory_no}/${brand.brand_no}/${product_no}/mainImage` })
       const mainImage = Image[0];
       const product_info={
       name:data.name,description:data.description,mainImage,price:data.price,subPrice:data.price,quantity:data.quantity,product_no,
       category:category._id,subCategory:subcategory._id,brand:brand._id
       }
       if(data?.discount){
         product_info['subPrice']=data.price - (data.price * data.discount / 100)
         product_info['discount']=data.discount
       }
       if(images.subImages){
        const subImages= await this.FileUploadService.uploadFiles(images.subImages, { folder: `e_commerce/categories/${category.category_no}/${subcategory.subcategory_no}/${brand.brand_no}/${product_no}/subImages` })
        product_info['subImages']=subImages
      }
      const new_product=await this.productRepository.create(product_info)
      return new_product
    
   }
///////////////////////////////////// update product //////////////////////////////////////
async update_product(id, data, images) {
   const product = await this.productRepository.findOne({_id:id});
   if (!product) {
     throw new NotFoundException("Product not found");
   }
   const category = await this.categoyRepository.findOne({ _id:product.category}) 
   const subcategory = await this.SubCategoryRepository.findOne({ _id:product.subCategory}) 
   const brand = await this.BrandRepository.findOne({ _id:product.brand}) 
   const updateData = {
       
   }
   if (images?.subImages) {
     await this.FileUploadService.deleteFiles(`e_commerce/categories/${category?.category_no}/${subcategory?.subcategory_no}/${brand?.brand_no}/${product.product_no}/subImages`);
     const subImages= await this.FileUploadService.uploadFiles(images.subImages, { folder: `e_commerce/categories/${category?.category_no}/${subcategory?.subcategory_no}/${brand?.brand_no}/${product?.product_no}/subImages` })
        updateData['subImages']=subImages

   }
   if (images?.mainImage) {
      await this.FileUploadService.deleteFiles(`e_commerce/categories/${category?.category_no}/${subcategory?.subcategory_no}/${brand?.brand_no}/${product.product_no}/mainImage`);
      let Image= await this.FileUploadService.uploadFiles(images.mainImage, { folder: `e_commerce/categories/${category?.category_no}/${subcategory?.subcategory_no}/${brand?.brand_no}/${product?.product_no}/mainImage` })
      updateData['mainImage'] = Image[0];
    }
    
    if (data?.price && data?.discount) {
      updateData['subPrice']=data.price - (data.price * data.discount / 100)
      updateData['discount']=data.discount
      updateData['price']=data.price
    }
      
   else if(data?.discount){
      updateData['subPrice']=product.price - (product.price * data.discount / 100)
      updateData['discount']=data.discount
    }
    else if(data?.price){
      updateData['subPrice']=data.price - (data.price * product.discount / 100)
      updateData['price']=data.price
   }
 if(data?.name)updateData['name']=data.name
 if(data?.quantity)updateData['quantity']=data.quantity
 if(data?.description)updateData['description']=data.description
  
   // Save update
   const updated = await this.productRepository.update({_id:id}, updateData);
   return updated;
 }
 
 /////////////////////////////////////  delete  product//////////////////////////////////////
async delete_product(id) {
   const product = await this.productRepository.findOne({_id:id});
   if (!product) {
     throw new NotFoundException("Product not found");
   }
   const category = await this.categoyRepository.findOne({ _id:product.category}) 
   const subcategory = await this.SubCategoryRepository.findOne({ _id:product.subCategory}) 
   const brand = await this.BrandRepository.findOne({ _id:product.brand}) 
   
   if (product?.subImages ||product?.mainImage) {
     await this.FileUploadService.deleteFiles(`e_commerce/categories/${category?.category_no}/${subcategory?.subcategory_no}/${brand?.brand_no}/${product.product_no}`);

   }
 
   const deleted_product = await this.productRepository.delete({_id:id});
   return {mesg:'deleted',deleted_product};
 }
 
/////////////////////////////////////  search for product using cashing//////////////////////////////////////
async search_for_products(filter) {
  
let products= await this.cacheManager.get('list');
   let quary_info:FilterQuery<ProductDocument>={}
       if(filter?.name){
         quary_info={
           $or: [
             { name: { $regex: filter.name, $options: 'i' } },
             { slug: { $regex: filter.name, $options: 'i' } }
           ]
         }
       }
       if(filter?.category_name) {
         const category=await this.categoyRepository.findOne({name:filter.category_name})
         quary_info = {
           ...quary_info,
           category: category?._id
         };
       }
       if(filter?.subcategory_name) {
         const subcategory=await this.SubCategoryRepository.findOne({name:filter.subcategory_name})
         quary_info = {
           ...quary_info,
           subcategory: subcategory?._id
         }};
         if(filter?.brand_name) {
            const brand=await this.BrandRepository.findOne({name:filter.brand_name})
            quary_info = {
              ...quary_info,
              brand: brand?._id
            }}
       if (filter.select) {
         filter.select = filter.select.replace(/,/, ' ');
       }
       const list_of_products=this.productRepository.findAll({
        filter: quary_info,sort:filter.sort,select:filter.select,page:filter.page
      }); if(!products) {
        
      await this.cacheManager.set('list',list_of_products);
      return list_of_products;
    }
  
    return products;
 

}}

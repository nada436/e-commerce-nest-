import { BadRequestException, Injectable } from '@nestjs/common';
import { categoyRepository } from './../../repository/Category.repository.service ';
import { FileUploadService } from './../../common/services/cloudinary/uploud_file.service';

@Injectable()
export class CategoryService {
constructor(private readonly CategoyRepository:categoyRepository,private readonly FileUploadService:FileUploadService){}
//////////////////////////////////////new category/////////////////////////////////
create_category=async(data,image,user) => {
const category_name=await this.CategoyRepository.findOne({name:data.name})
if(category_name){
     throw new BadRequestException('this category name already exist')}
     const category_no = Math.floor(Math.random() * 1000); // Random number from 0 to 999

const category_info={
        name:data.name,
        userId:user._id,
        category_no
       }
//uploud image
        if(image) {
            const { secure_url, public_id }=await this.FileUploadService.uploadFile(image,{folder:`e_commerce/categories/${category_no}`})
            category_info['image']={ secure_url, public_id }
        }
const new_category=await this.CategoyRepository.create(category_info)
return new_category
    }

///////////////////////////////////////update category/////////////////////////////
update_category=async(data,image,id) => {
    const category=await this.CategoyRepository.findOne({_id:id})
    if(!category){
      throw new BadRequestException('this category is not exist')}

    if(data?.name){
        const is_exist=await this.CategoyRepository.findOne({name:data.name})
    if(is_exist){
     throw new BadRequestException('category name must be uniqe')}
    category.name=data.name
    }
    if(image){
        await this.FileUploadService.deleteFile(
            (category.image as { public_id: string }).public_id
          );
     const { secure_url, public_id } =await this.FileUploadService.uploadFile(image,{folder:`e_commerce/categories/${category.category_no}`})
     category['image']={ secure_url, public_id }
    }await category.save()
    return {msg:`updated successfully`,category}
}
///////////////////////////////////////delete category/////////////////////////////
delete_category=async(id) => {
    const category=await this.CategoyRepository.findOne({_id:id})
    if(!category){
      throw new BadRequestException('this category is not exist')}
      
    if(category?.image){
        await this.FileUploadService.deleteFiles(`e_commerce/categories/${category.category_no}`)
    }await this.CategoyRepository.delete({_id:id})
    return {msg:`deleted successfully`,category}
}
///////////////////////////////////////get category/////////////////////////////
get_category=async(filterdata) => {
    const category=await this.CategoyRepository.findOne(filterdata)
    if(!category){
      throw new BadRequestException('this category is not exist')}
    return category
}



}



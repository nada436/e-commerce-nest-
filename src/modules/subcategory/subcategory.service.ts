import { BadRequestException, Injectable } from '@nestjs/common';
import { populate } from 'dotenv';
import { FilterQuery, Types } from 'mongoose';
import slugify from 'slugify';
import { FileUploadService } from 'src/common/services/cloudinary/uploud_file.service';
import { Category, SubCategoryDocument } from 'src/database/models';
import { categoyRepository } from 'src/repository/Category.repository.service ';
import { SubCategoryRepository } from 'src/repository/SubCategory.repository.service';


@Injectable()
export class SubCategoryService {
  constructor(
    private readonly subCategoryRepository: SubCategoryRepository,
    private readonly fileUploadService: FileUploadService,
    private readonly categoryRepository: categoyRepository,
  ) {}

  ////////////////////////////// CREATE SUBCATEGORY ////////////////////////////
  async createSubCategory(data, image, user) {
    const existingSubCategory = await this.subCategoryRepository.findOne({ name: data.name });
    if (existingSubCategory) {
      throw new BadRequestException('This subcategory name already exists');
    }

    const category = await this.categoryRepository.findOne({ _id: data.category });
    if (!category) {
      throw new BadRequestException('Invalid category');
    }
    const subcategory_no = Math.floor(Math.random() * 1000); // Random number from 0 to 999
    const subCategoryInfo = {
      name: data.name,
      userId: user._id,
      category: new Types.ObjectId(data.category),
      subcategory_no
    };
    
    if (image) {
      const { secure_url, public_id } = await this.fileUploadService.uploadFile(
        image,
        { folder: `e_commerce/categories/${category.category_no}/${subcategory_no}` },
      );
      subCategoryInfo['image'] = { secure_url, public_id };
    }

    const newSubCategory = await this.subCategoryRepository.create(subCategoryInfo);
    return newSubCategory;
  }

  ////////////////////////////// UPDATE SUBCATEGORY ////////////////////////////
  async updateSubCategory(data, image, id) {
    const subCategory = await this.subCategoryRepository.findOne({ _id: id },[{path:"category"}]);
    if (!subCategory) {
      throw new BadRequestException('SubCategory not found');
    }

    if (data.name && data.name !== subCategory.name) {
      const existingSubCategory = await this.subCategoryRepository.findOne({ name: data.name });
      if (existingSubCategory) {
        throw new BadRequestException('SubCategory name must be unique');
      }
      subCategory.name = data.name;
    }

    if (image) {
        const category = await this.categoryRepository.findOne({ _id: subCategory.category });
      if (subCategory.image?.public_id) {
        await this.fileUploadService.deleteFile(subCategory.image.public_id);
      }

      const { secure_url, public_id } = await this.fileUploadService.uploadFile(
        image,
        { folder: `e_commerce/categories/${category?.category_no}/${subCategory.subcategory_no}` },
      );
      subCategory.image = { secure_url, public_id };
    }

    await subCategory.save();
    return { message: 'SubCategory updated successfully', subCategory };
  }

  ////////////////////////////// DELETE SUBCATEGORY ////////////////////////////
  async deleteSubCategory(id) {
    const subCategory = await this.subCategoryRepository.findOne({ _id: id });
    if (!subCategory) {
      throw new BadRequestException('SubCategory not found');
    }

    if (subCategory.image?.public_id) {
      await this.fileUploadService.deleteFile(subCategory.image.public_id);
    }

    await this.subCategoryRepository.delete({ _id: id });
    return { message: 'SubCategory deleted successfully', subCategory };
  }

  ////////////////////////////// GET SUBCATEGORY ////////////////////////////
  async getSubCategory(filter: any) {
    const subCategory = await this.subCategoryRepository.findOne(filter);
    if (!subCategory) {
      throw new BadRequestException('SubCategory not found');
    }
    return subCategory;
  }

  ////////////////////////////// GET ALL SUBCATEGORIES ////////////////////////////
  async getAllSubCategories(filter) {
    let quary_info:FilterQuery<SubCategoryDocument>={}
    if(filter.name){
      quary_info={
        $or: [
          { name: { $regex: filter.name, $options: 'i' } },
          { slug: { $regex: filter.name, $options: 'i' } }
        ]
      }
    }
    if(filter.category) {
      quary_info = {
        ...quary_info,
        category: filter.category
      };
    }
    if (filter.select) {
      filter.select = filter.select.replace(/,/, ' ');
    }
    return this.subCategoryRepository.findAll({
      filter: quary_info,
      populate: [{ path: 'category' }],sort:filter.sort,select:filter.select,page:filter.page
    });
  }
  
  

}
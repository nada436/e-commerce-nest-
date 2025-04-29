import { BadRequestException, Injectable } from '@nestjs/common';
import { FileUploadService } from 'src/common/services/cloudinary/uploud_file.service';
import { BrandRepository } from 'src/repository/Brand.repository.service';

import { FilterQuery, Types } from 'mongoose';
import { categoyRepository } from 'src/repository/Category.repository.service ';
import { SubCategoryRepository } from 'src/repository/SubCategory.repository.service';
import { Brand, BrandDocument } from 'src/database/models';


@Injectable()
export class BrandService {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly fileUploadService: FileUploadService,
    private readonly categoryRepository: categoyRepository,
    private readonly subCategoryRepository: SubCategoryRepository,
  ) {}

  ////////////////////////////// CREATE BRAND ////////////////////////////
  async createBrand(data: any, image: any, user: any) {
    const existingBrand = await this.brandRepository.findOne({ name: data.name });
    if (existingBrand) {
      throw new BadRequestException('This brand name already exists');
    }

    // Validate category and subcategory
    const category = await this.categoryRepository.findOne({_id:data.category});
    if (!category) {
      throw new BadRequestException('Invalid category');
    }

    const subCategory = await this.subCategoryRepository.findOne({_id:data.subcategory});
    if (!subCategory) {
      throw new BadRequestException('Invalid subcategory');
    }
  const brand_no=Math.floor(Math.random() * 1000); // Random number from 0 to 999
    const brandInfo = {
      name: data.name,
      userId: user._id,
      category: new Types.ObjectId(data.category),
      subCategory: new Types.ObjectId(data.subcategory),
      brand_no
    };

    // Upload image if exists
    if (image) {
      const { secure_url, public_id } = await this.fileUploadService.uploadFile(
        image,
        { folder: `e_commerce/categories/${category.category_no}/${subCategory.subcategory_no}/${brand_no}` },
      );
      brandInfo['image'] = { secure_url, public_id };
    }

    const newBrand = await this.brandRepository.create(brandInfo);
    return newBrand;
  }

  ////////////////////////////// UPDATE BRAND ////////////////////////////
  async updateBrand(data, image, id) {
    const brand = await this.brandRepository.findOne({_id:id});
    if (!brand) {
      throw new BadRequestException('Brand not found');
    }

    // Check name uniqueness if changed
    if (data.name && data.name !== brand.name) {
      const existingBrand = await this.brandRepository.findOne({ name: data.name });
      if (existingBrand) {
        throw new BadRequestException('Brand name must be unique');
      }
      brand.name = data.name;
    }


    // Handle image update
    if (image) {
      const subCategory = await this.subCategoryRepository.findOne({_id:brand.subCategory});
      const Category = await this.categoryRepository.findOne({_id:brand.category});
      if(Category&&subCategory){
 // Delete old image if exists
 await this.fileUploadService.deleteFiles(`e_commerce/categories/${Category.category_no}/${subCategory.subcategory_no}/${brand.brand_no}`);
      }

      const { secure_url, public_id } = await this.fileUploadService.uploadFile(
        image,
        { folder: `e_commerce/categories/${Category?.category_no}/${subCategory?.subcategory_no}/${brand.brand_no}` },
      );
      brand.image = { secure_url, public_id };
    }

    await brand.save();
    return { message: 'Brand updated successfully', brand };
  }

  ////////////////////////////// DELETE BRAND ////////////////////////////
  async deleteBrand(id) {
    const brand = await this.brandRepository.findOne({_id:id});
    const subCategory = await this.subCategoryRepository.findOne({_id:brand?.subCategory});
    const Category = await this.categoryRepository.findOne({_id:brand?.category});
    if (!brand) {
      throw new BadRequestException('Brand not found');
    }

    // Delete associated image
    if (brand.image?.public_id) {
      await this.fileUploadService.deleteFiles(`e_commerce/categories/${Category?.category_no}/${subCategory?.subcategory_no}/${brand?.brand_no}`);
    }

    await this.brandRepository.delete({ _id: id });
    return { message: 'Brand deleted successfully', brand };
  }

  ////////////////////////////// GET BRAND ////////////////////////////
  async getBrand(filter: any) {
    const brand = await this.brandRepository.findOne(filter);
    if (!brand) {
      throw new BadRequestException('Brand not found');
    }
    return brand;
  }

  ////////////////////////////// GET ALL BRANDS ////////////////////////////
  async getAllBrands(filter) {
        let quary_info:FilterQuery<BrandDocument>={}
        if(filter.name){
          quary_info={
            $or: [
              { name: { $regex: filter.name, $options: 'i' } },
              { slug: { $regex: filter.name, $options: 'i' } }
            ]
          }
        }
        if (filter.select) {
          filter.select = filter.select.replace(/,/, ' ');
        }
        return this.brandRepository.findAll({
          filter: quary_info,sort:filter.sort,select:filter.select,page:filter.page
        });
  }
  
}
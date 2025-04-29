import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/common/decorator/auth.decorator';
import { UserRoles } from 'src/common/types/types';
import { CreateproductDto, search_filter } from 'src/common/dto/product.dto';
import { validate } from 'class-validator';
import { fileTypes, multer_cloudinary } from 'src/common/multer';
import { updateCategoryDto } from 'src/common/dto/category_dto';
import { all_subcategory_filter } from 'src/common/dto/subcategory.dto';

@Controller('product')
export class ProductController {
    constructor(private readonly ProductService:ProductService){}
    @Post('/add')
    @Auth([UserRoles.admin])
    @UsePipes(new ValidationPipe())
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImages', maxCount: 5 },
      ],multer_cloudinary(fileTypes.image)))
      add_product(@Body() data:CreateproductDto,@UploadedFiles() images: { mainImage?: Express.Multer.File[], subImages?: Express.Multer.File[] }) {
      return this.ProductService.add_product(data,images)
      }

      @Delete('/delete/:id')
      @Auth([UserRoles.admin])
        delete_product(@Param('id') id:String) {
        return this.ProductService.delete_product(id)
        }

        @Patch('/update/:id')
        @Auth([UserRoles.admin])
        @UsePipes(new ValidationPipe())
        @UseInterceptors(FileFieldsInterceptor([
            { name: 'mainImage', maxCount: 1 },
            { name: 'subImages', maxCount: 5 },
          ],multer_cloudinary(fileTypes.image)))
          update_product(@Param('id') id:String,@Body() data:updateCategoryDto,@UploadedFiles() images: { mainImage?: Express.Multer.File[], subImages?: Express.Multer.File[] }) {
          return this.ProductService.update_product(id,data,images)
          }

       @Get('/search')
       @Auth(['admin', 'user'])
       get_all_subcategories(@Query() filter: search_filter) {
         return this.ProductService.search_for_products(filter);
     }
}

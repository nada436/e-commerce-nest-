import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCategoryDto, updateCategoryDto } from 'src/common/dto/category_dto';
import { Auth } from 'src/common/decorator/auth.decorator';
import { GetUser } from 'src/common/decorator/user.decorator';
import { UserDocument } from 'src/database/models';
import { fileTypes, multer_cloudinary } from 'src/common/multer';
import { get, ObjectId } from 'mongoose';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}
  
    @Post('/new')
    @UseInterceptors(FileInterceptor('image',multer_cloudinary(fileTypes.image)))
    @Auth(['admin'])
    @UsePipes(new ValidationPipe())
    create_category(
      @UploadedFile() file: Express.Multer.File,
      @Body() body: CreateCategoryDto,@GetUser() user:UserDocument
    ) {
      return this.categoryService.create_category(body, file,user);
    }

    @Patch('/update/:id')
    @UseInterceptors(FileInterceptor('image',multer_cloudinary(fileTypes.image)))
    @Auth(['admin'])
    @UsePipes(new ValidationPipe())
    update_category(
      @UploadedFile() file: Express.Multer.File,
      @Body() body: updateCategoryDto,@Param('id') id:string
    ) {
      return this.categoryService.update_category(body,file,id);
    }

    @Delete('/delete/:id')
    @Auth(['admin'])
    delete_category(
    @Param('id') id:string
    ) {
      return this.categoryService.delete_category(id);
    }
  
    @Get('/')
    @Auth(['admin', 'user'])
    get_category(
      @Query() filterdata: any, 
    ) {
      return this.categoryService.get_category(filterdata); 
    }
  }    
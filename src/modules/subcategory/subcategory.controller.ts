import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileTypes, multer_cloudinary } from 'src/common/multer';
import { Auth } from 'src/common/decorator/auth.decorator';
import { all_subcategory_filter, CreateSubCategoryDto, UpdateSubCategoryDto } from 'src/common/dto/subcategory.dto';
import { GetUser } from 'src/common/decorator/user.decorator';
import { UserDocument } from 'src/database/models';
import { SubCategoryService } from './subcategory.service';


@Controller('subcategory')
export class SubCategoryController {
    constructor(private readonly subCategoryService: SubCategoryService) {}
  
    @Post('/new')
    @UseInterceptors(FileInterceptor('image', multer_cloudinary(fileTypes.image)))
    @Auth(['admin'])
    @UsePipes(new ValidationPipe())
    create_subcategory(
      @UploadedFile() file: Express.Multer.File,
      @Body() body: CreateSubCategoryDto,
      @GetUser() user: UserDocument
    ) {
      return this.subCategoryService.createSubCategory(body, file, user);
    }

    @Patch('/update/:id')
    @UseInterceptors(FileInterceptor('image', multer_cloudinary(fileTypes.image)))
    @Auth(['admin'])
    @UsePipes(new ValidationPipe())
    update_subcategory(
      @UploadedFile() file: Express.Multer.File,
      @Body() body: UpdateSubCategoryDto,
      @Param('id') id: string
    ) {
      return this.subCategoryService.updateSubCategory(body, file, id);
    }

    @Delete('/delete/:id')
    @Auth(['admin'])
    delete_subcategory(
      @Param('id') id: string
    ) {
      return this.subCategoryService.deleteSubCategory(id);
    }
  
    @Get('/')
    @Auth(['admin', 'user'])
    get_subcategory(@Query() filter: any) {
        return this.subCategoryService.getSubCategory(filter);
    }

    @Get('/all')
    @Auth(['admin', 'user'])
    get_all_subcategories(@Query() filter: all_subcategory_filter) {
        return this.subCategoryService.getAllSubCategories(filter);
    }

     
}
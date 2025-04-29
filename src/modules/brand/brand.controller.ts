import {
    Controller,
    Post,
    Put,
    Delete,
    Get,
    Param,
    Body,
    UploadedFile,
    UseInterceptors,
    Query,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { BrandService } from './brand.service';
  import { User } from 'src/database/models';
  import { GetUser } from 'src/common/decorator/user.decorator';
import { CreateBrandDto, UpdateBrandDto } from 'src/common/dto/brand.dto';
import { Auth } from 'src/common/decorator/auth.decorator';
import { fileTypes, multer_cloudinary } from 'src/common/multer';
import { all_subcategory_filter } from 'src/common/dto/subcategory.dto';
  
  @Controller('brand')
  export class BrandController {
    constructor(private readonly brandService: BrandService) {}
    
    @Post('/new')
    @UseInterceptors(FileInterceptor('image',multer_cloudinary(fileTypes.image)))
    @Auth(['admin'])
    async createBrand(
      @Body() data: CreateBrandDto,
      @UploadedFile() image:Express.Multer.File,
      @GetUser() user: string,
    ) {
      return this.brandService.createBrand(data, image, user);
    }
  
    @Put(':id')
    @UseInterceptors(FileInterceptor('image',multer_cloudinary(fileTypes.image)))
    @Auth(['admin'])
    async updateBrand(
      @Param('id') id: string,
      @Body() data: UpdateBrandDto,
      @UploadedFile() image: Express.Multer.File,
    ) {
      return this.brandService.updateBrand(data, image, id);
    }
  
    @Delete(':id')
    @Auth(['admin'])
    async deleteBrand(@Param('id') id: string) {
      return this.brandService.deleteBrand(id);
    }
  
    @Get(':id')
    async getBrand(@Param('id') id: string) {
      return this.brandService.getBrand({ _id: id });
    }
  
    @Get('/')
    @Auth(['admin', 'user'])
    get_all_brands(@Query() filter: all_subcategory_filter) {
    return this.brandService.getAllBrands(filter);
        }
  }
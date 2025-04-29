import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryModel } from 'src/database/models';
import { categoyRepository } from 'src/repository/Category.repository.service ';
import { FileUploadService } from 'src/common/services/cloudinary/uploud_file.service';

@Module({
  imports:[CategoryModel],
  providers: [CategoryService,categoyRepository,FileUploadService],
  controllers: [CategoryController],
  exports:[categoyRepository]
})
export class CategoryModule {}

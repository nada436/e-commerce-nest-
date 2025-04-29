import { Module } from '@nestjs/common';
import { SubCategoryModel } from 'src/database/models';
import { SubCategoryRepository } from 'src/repository/SubCategory.repository.service';
import { SubCategoryService } from './subcategory.service';
import { SubCategoryController } from './subcategory.controller';

@Module({
  providers: [SubCategoryService],
  controllers: [SubCategoryController]
})
export class SubcategoryModule {}

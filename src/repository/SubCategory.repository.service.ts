import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseRepository } from './database.repository.service';
import { SubCategory, SubCategoryDocument } from 'src/database/models';

@Injectable()
export class SubCategoryRepository extends DatabaseRepository<SubCategoryDocument> {
  constructor(
    @InjectModel(SubCategory.name)
    private readonly SubCategoryModel: Model<SubCategoryDocument>,
  ) {
    super(SubCategoryModel);
  }
}

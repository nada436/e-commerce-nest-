import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseRepository } from './database.repository.service';
import { Category, CategoryDocument } from 'src/database/models';

@Injectable()
export class categoyRepository extends DatabaseRepository<CategoryDocument> {
  constructor(
    @InjectModel(Category.name)
    private readonly CategoryModel: Model<CategoryDocument>,
  ) {
    super(CategoryModel);
  }
}

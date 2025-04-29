import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseRepository } from './database.repository.service';
import { Brand, BrandDocument } from 'src/database/models/BrandModel';

@Injectable()
export class BrandRepository extends DatabaseRepository<BrandDocument> {
  constructor(
    @InjectModel(Brand.name) private readonly BrandModel: Model<BrandDocument>,
  ) {
    super(BrandModel);
  }
}

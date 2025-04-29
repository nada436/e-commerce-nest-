import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsMongoId, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { filter_quary } from './filter_quary.dto';

export class CreateSubCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsNotEmpty()
  category: Types.ObjectId;
}

export class UpdateSubCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;
  
  @IsOptional()
  image?: object;
 
}

export class all_subcategory_filter extends filter_quary {
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  category?:string
}
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsMongoId, IsOptional } from 'class-validator';
import { ObjectId, Types } from 'mongoose';
import { all_subcategory_filter } from './subcategory.dto';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty()
  name: string;
 
  @IsNotEmpty()
  category: String;

  
  @IsNotEmpty()
  subcategory: String;

  
  image?: object;
}

export class UpdateBrandDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsOptional()
  image?: object;
}




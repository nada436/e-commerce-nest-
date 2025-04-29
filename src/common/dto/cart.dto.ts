import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsMongoId, IsOptional, IsNumber } from 'class-validator';

export class CreatecartDto {
  @IsMongoId()
  @IsNotEmpty()
  product_id: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}



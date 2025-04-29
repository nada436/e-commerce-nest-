import { IsNotEmpty, IsString, MaxLength, MinLength, IsObject, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @MinLength(4)
  name: string;

}
export class updateCategoryDto {
  @IsOptional()
  @IsString()
  @MaxLength(30)
  @MinLength(4)
  name: string;

}

import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { filter_quary } from "./filter_quary.dto";

export class CreateproductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  discount?: number;

  @Type(() => Number)
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  brand_name: string;

  @IsNotEmpty()
  @IsString()
  subCategory_name: string;

  @IsNotEmpty()
  @IsString()
  category_name: string;



}



export class updateproductDto {
    @IsOptional()
    @IsString()
    name: string;
  
    @IsOptional()
    @IsString()
    description: string;
  
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    price: number;
  
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    discount?: number;
  
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    quantity: number;
  
  
  }

  export class search_filter extends filter_quary {
    @IsString()
    @IsOptional()
    name?: string;
    @IsString()
    @IsOptional()
    category_name?:string
    @IsString()
    @IsOptional()
    subcategory_name?:string
    @IsString()
    @IsOptional()
    brand_name?:string
  }
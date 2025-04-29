import { Optional } from "@nestjs/common";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateorderDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  
  @IsString()
  @Optional()
  copoun_code?: String;

  

  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  

}



